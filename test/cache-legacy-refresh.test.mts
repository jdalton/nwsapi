import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import { JSDOM } from 'jsdom'
import { expect, test } from 'vitest'
import type factory from '../src/nwsapi.js'

for (const map of [undefined, {}]) {
  test(`the cache preserves hosts with ${map === undefined ? 'missing' : 'non-callable'} Map`, t => {
    const { window } = new JSDOM('<p class="item"></p>')
    t.onTestFinished(() => window.close())
    const context = {
      module: { exports: {} as typeof factory },
      exports: {},
      Map: map,
    }
    vm.runInNewContext(
      readFileSync(new URL('../src/nwsapi.js', import.meta.url), 'utf8'),
      context,
    )
    const nw = context.module.exports({ document: window.document })
    nw.configure({ LEGACY: true })
    const element = window.document.querySelector('p')
    expect(nw.select('.item')).toEqual([element])
    element.className = 'changed'
    expect(nw.select('.item')).toHaveLength(0)
    expect(nw.match('.changed', element)).toBe(true)
    nw.configure({}, true)
    expect(nw.select('.changed')).toEqual([element])
  })
}
