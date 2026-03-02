'use strict';

const { STRICT_RELIGIOUS_MODE } = require('./config');

const RETRY_WITH_GET_STATUS = new Set([403, 405, 406, 429, 500, 501, 502, 503, 504]);

function isGenericLandingPage(url) {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname || '';
    return (
      path === '' ||
      path === '/' ||
      path === '/fr' ||
      path === '/en' ||
      path === '/ar'
    );
  } catch (_) {
    return true;
  }
}

async function safeFetch(fetchImpl, url, init) {
  try {
    const response = await fetchImpl(url, init);
    return { response, error: null };
  } catch (error) {
    return { response: null, error };
  }
}

class LinkVerifier {
  constructor(options = {}) {
    this.fetchImpl = options.fetchImpl || global.fetch;
    this.now = options.now || (() => new Date().toISOString());
    this.strict = options.strict ?? STRICT_RELIGIOUS_MODE;
  }

  async verifySource(source) {
    if (typeof this.fetchImpl !== 'function') {
      return {
        url: source.url,
        status: 'manual_check_required',
        checked_at: this.now(),
        reason: 'fetch_not_available'
      };
    }

    const headResult = await safeFetch(this.fetchImpl, source.url, {
      method: 'HEAD',
      redirect: 'follow'
    });

    if (headResult.error) {
      return {
        url: source.url,
        status: 'failed',
        checked_at: this.now(),
        reason: 'head_request_error'
      };
    }

    let response = headResult.response;
    if (RETRY_WITH_GET_STATUS.has(response.status)) {
      const getResult = await safeFetch(this.fetchImpl, source.url, {
        method: 'GET',
        redirect: 'follow'
      });
      if (getResult.error) {
        return {
          url: source.url,
          status: 'failed',
          http_status: response.status,
          final_url: response.url || source.url,
          checked_at: this.now(),
          reason: 'get_request_error_after_head'
        };
      }
      response = getResult.response;
    }

    const finalUrl = response.url || source.url;
    const baseRecord = {
      url: source.url,
      http_status: response.status,
      final_url: finalUrl,
      checked_at: this.now()
    };

    if (response.status >= 500) {
      return { ...baseRecord, status: 'failed', reason: 'server_error' };
    }

    if (response.status === 404) {
      return { ...baseRecord, status: 'failed', reason: 'not_found' };
    }

    if (response.status === 403) {
      return { ...baseRecord, status: 'failed', reason: 'forbidden' };
    }

    if (!response.ok) {
      return { ...baseRecord, status: 'failed', reason: 'unreachable' };
    }

    if (this.strict && isGenericLandingPage(finalUrl)) {
      return { ...baseRecord, status: 'failed', reason: 'generic_landing_page' };
    }

    if (!source.precise_locator) {
      return {
        ...baseRecord,
        status: 'manual_check_required',
        reason: 'missing_precise_locator'
      };
    }

    if (response.status === 200) {
      return { ...baseRecord, status: 'passed' };
    }

    return { ...baseRecord, status: 'manual_check_required', reason: 'non_200_response' };
  }

  async verifyMany(sources) {
    const tasks = (Array.isArray(sources) ? sources : []).map((source) =>
      this.verifySource(source).then((verification) => ({ source, verification }))
    );
    return Promise.all(tasks);
  }
}

module.exports = {
  LinkVerifier,
  isGenericLandingPage
};
