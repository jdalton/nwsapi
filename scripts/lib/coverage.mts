import path from 'node:path'
import libCoverage from 'istanbul-lib-coverage'

// Browser engine coverage and Node adapter coverage have separate owners.
export function combineCoverage(wptData, nodeData, root) {
  const wpt = libCoverage.createCoverageMap(wptData)
  const node = libCoverage.createCoverageMap(nodeData)
  const engine = path.join(root, 'src/nwsapi.js')
  const adapter = path.join(root, 'src/dom-selector.js')
  if (!wpt.files().includes(engine))
    throw new Error('Missing WPT engine coverage')
  if (!node.files().includes(adapter))
    throw new Error('Missing Node adapter coverage')
  const combined = libCoverage.createCoverageMap({})
  combined.addFileCoverage(wpt.fileCoverageFor(engine))
  combined.addFileCoverage(node.fileCoverageFor(adapter))
  return combined
}
