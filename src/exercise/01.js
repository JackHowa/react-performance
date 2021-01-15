// Code splitting
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'

// reusable load globe
const loadGlobe = () => import('../globe')

// code be already loaded because bundler keeps track of loader already
const Globe = React.lazy(loadGlobe)

function eagerLoad() {
  // eager load components
  // use dynamic imports
  // doesn't matter how many times this is called mul
  loadGlobe()
}

function App() {
  const [showGlobe, setShowGlobe] = React.useState(false)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        padding: '2rem',
      }}
    >
      <label
        style={{ marginBottom: '1rem' }}
        // doesn't matter how many times this is called
        // use dynamic imports to override the lazy loading globe
        onFocus={eagerLoad}
        onMouseEnter={eagerLoad}
      >
        <input
          type="checkbox"
          checked={showGlobe}
          onChange={e => setShowGlobe(e.target.checked)}
        />
        {' show globe'}
      </label>
      <div style={{ width: 400, height: 400 }}>
        {/* interestingly I'd expect the suspense to wrapped around the
      actual component that I'm lazy loading */}
        <React.Suspense fallback={'loading globe'}>
          {showGlobe ?
            <Globe />
            : null}
        </React.Suspense>
      </div>
    </div>
  )
}
// 🦉 Note that if you're not on the isolated page, then you'll notice that this
// app actually already has a React.Suspense component higher up in the tree
// where this component is rendered, so you *could* just rely on that one.

export default App
