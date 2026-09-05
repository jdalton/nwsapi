# No-loss integration checkpoint

This branch is an audit artifact, not a product PR or a merge-ready release.
It reconstructs the engine work extracted from #167 and records the conflicts
that require deliberate integration. Draft parser and media behavior remains
draft. The original archive is unchanged.

## Inputs

| Input | Revision |
| --- | --- |
| Upstream master | `fe15bc3ae8f76725a13b329aad2efbe3fa75f9a4` |
| Original #167 archive | `bc704565c1bd14f1f22c285cc76d4e507687acaa` |
| Initial 16-extraction reconstruction | `41365f06779434f2c9a33bf9da04f10ca52984f7` |
| Correctness/legacy integration checkpoint | `f7f5af2efe1078c76aba4bbf5fd97ba59822a3ee` |
| #182 repaired declaration | `ec74648a011bd28d22dc51a9625c26d7660666d4` |
| #198 attribute failure | `f65d449c0146f0269afdbeb100abaafaa07f4960` |
| #199 forgiving lists | `6033ef9c8f8dbfa5a7e8c5a919938ed2333671d8` |
| #200 attribute equality | `8e8ec8cdc5930d38859875b99bb6d5790e0b942e` |
| #201 relative `:has()` | `8b633278d9de6d05ade045593621223f1fa7092c` |
| #202 media preservation | `08be56cd318090e637947a6e64548070991355c2` |
| #203 legacy source | `beebb5170f3bcb1ff6754fe7fd140823e49898b4` |
| #203 public integration recipes | `91670d67b7b47e26dcdd1cbaff91e21b1409cf16` |
| #189 adaptive delta, from `1de1cb89d164088575ca2764e42ee358c94fd8fb` | `71acbee47de38284d043ecd6dc853d1f913023b4` |
| #205 resolver execution | `b2642d99aede8ead8c29769723507c2bf16158a2` |
| #204 compound negation source | `d25f5ea43066c1674a0274db380706bd46cdf2c8` |
| #206 descendant routing | `205743cfb418d3c928770cf2616d0b3361cb2751` |
| #207 hover tracking | `a0bacea3500235538f4cbd2fe5ae7fd8455ec482` |

The initial reconstruction contains #178, #180, #182, and #184–#196.
The next checkpoint fixes #182 and integrates #198–#203. Starting from that
checkpoint, this commit applies the adaptive delta, then source patches from
#205, #204, #206, and #207, resolving the interactions below. Test files are
copied from the archived aggregate and the focused branches. They resolve
the engine relative to this checkout, not another worktree.

## Conflict resolutions and ownership

- Retain legacy collection filtering and traversal when adopting #205's
  captured slicing. Keep #187's `argsWith` wrappers; only its wide-arity
  fallback changes to `sliceCall(args).concat(tail)`.
- Combine compiler helper aliases, adaptive resolver state, and the
  mode/callback cache key. Bound both array and item loops. Initialize the
  item result index and continue its loop without replacing the result array.
- Preserve pending tag tests around each combinator while retaining legacy
  read tables and positive-ancestor requirements.
- Save and restore `A_REQD`, `A_PEND`, and `A_WALK` around nested compound
  negation. Tags inside a negation must not become positive filter requirements.
  #204 documents this prerequisite-specific recipe publicly.
- Adapt #190's disabled helper and #193's defined helper to `tagOf`, `upOf`,
  `firstOf`, `nextOf`, `hasAttrOf`, and `attrOf`. Their original rule logic
  is unchanged. The three standalone #203 expected failures pass here.
- Keep one modern `classOf` with an `attrOf` fallback. Modern generated reads
  use that helper; legacy reads and rewriting use `legacyClassOf` under its
  own Snapshot key. This avoids both duplicate declarations and overwritten
  Snapshot properties. ID comparisons use the selected read table.
- Clear #178's `matcherDoc` and `matcherRecord` shortcuts in `switchContext`,
  without clearing the WeakMap. Retain descendant-count invalidation and
  hover tracking in the same hook.
- Use `upOf(anchor)` in #201's sibling `:has()` runtime helper. Its former
  direct `parentElement` read was outside the generated-code rewrite and
  lost sibling matches on legacy hosts. Both sibling forms have new tests.
- Keep #189's resolver-owned counters and `finally` cleanup. The archive's
  growing counter arrays are intentionally replaced, not lost.
- Preserve #200's corrected attribute-name case decision, #198's null guard,
  #195's uninstall restoration, #196's no-op condition, and #203's literal-safe
  generated-code rewrite. These differ intentionally from the archive.

#203's public documentation records the legacy, matcher, slicing, and relational
integration recipes. `test/integration-legacy.test.cjs` covers sibling anchors,
negation/filter state, and legacy class reads of non-elements.

An independent factory-declaration audit found 206 archived declarations and
205 integrated declarations, with 183 normalized initializers identical.
The absent names are the adaptive arrays/counter replaced by resolver-owned
state. The remaining changed initializers were accounted for as corrections,
relocations, or helper-based emission. No unowned engine feature was identified.

## Reproduction

Use Node.js ≥ 22 with a jsdom-supported patch: 22.22.2+, 24.15.0+, or 26+.
The package pins jsdom 30.0.1 for independent comparisons and the alias
`jsdom-reentry` at 26.1.0 for the original nwsapi-backed reproduction.

```sh
npm install
npx playwright install chromium
npm run test:audit:node
npm test
NWSAPI_BROWSER=1 npm run test:audit:focused
npm run test:audit:browser
npm run test:browser
```

No WPT checkout or web server is required for these commands.

Validation on Node 26.5.0:

| Run | Result |
| --- | --- |
| Original archived jsdom/legacy suite | 64 pass |
| Matcher alias and shared-runtime suite | 19 pass |
| Original jsdom 26 reentry suite | 8 pass |
| New focused extraction/integration tests, including Chromium equality | 62 pass, 5 TODO |
| Attribute parse-error tests | 19 pass, 4 TODO |
| Original Chromium browser agreement | 4 pass |
| Live browser factory/iframe/installation state | 5 scenarios pass; 6 Node test records including the parent |

An independent reviewer also ran 16 cross-PR probes covering nested negation,
legacy structural reads, literal host-read text, HTML attribute case rules,
and nested relative sibling anchors; all passed.

## Remaining gaps

The TODOs are preserved failures, not passes: four escaped string line
continuations, hexadecimal class escapes, two invalid `:has()` argument forms,
and the two media-state implications contradicted by the archive approximation.
They remain documented in #198, #199, draft #201, and draft #202 respectively.

The full WPT suite, historical browsers, and aggregate performance benchmarks
were not run. This checkpoint establishes preservation and tested integration
boundaries; it does not certify all archived behavior as correct.
