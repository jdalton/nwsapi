'use strict';
const assert = require('node:assert/strict');
const { test } = require('node:test');
const { JSDOM } = require('jsdom');
const factory = require('../src/nwsapi.js');

test('relative sibling has arguments retain legacy parent traversal', async t => {
  const { legacyHost } = await import('./node/legacy-host.mjs');
  const { window } = new JSDOM('<div id=a></div><div id=b></div>');
  t.after(() => window.close());
  const host = legacyHost(window.document);
  const nw = factory({ document: host, DOMException: window.DOMException });
  for (const selector of ['div:has(+ div)', 'div:has(~ div)']) {
    assert.deepEqual(nw.select(selector, host).map(e => e.id), ['a']);
  }
});

test('negated tags do not become required positive ancestor tags', t => {
  const { window } = new JSDOM('<div><ul><li><a id=a></a></li></ul></div>');
  t.after(() => window.close());
  const nw = factory(window);
  for (const selector of ['body div:not(section) ul li a', 'body div ul:not(section) li a', 'body div ul li:not(:not(li)) a']) {
    assert.match(nw.compile(selector, true).toString(), /mayMatch/);
    assert.deepEqual(nw.select(selector).map(e => e.id), ['a']);
  }
});

test('legacy class helpers reject non-elements after property-read integration', t => {
  const { window } = new JSDOM('<div class=null></div>');
  t.after(() => window.close());
  const nw = factory(window);
  nw.configure({ LEGACY: true });
  assert.equal(nw.match('.null', window.document.createComment('comment')), false);
  assert.equal(nw.match('.null', window.document.querySelector('div')), true);
});
