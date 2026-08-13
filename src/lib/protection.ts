export function initDevToolsProtection() {
  // Block all common DevTools shortcuts
  const blockKeys = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase()
    const blocked = [
      'f12',
      'f11',
      'f10',
      'f9',
      'f8',
      'f7',
      'f6',
      'f5',
    ]
    
    if (
      blocked.includes(key) ||
      (e.ctrlKey && e.shiftKey && ['i', 'j', 'c', 'k', 's', 'u', 'p'].includes(key)) ||
      (e.ctrlKey && ['u', 's', 'p'].includes(key)) ||
      (e.metaKey && e.altKey && ['i', 'j', 'c', 'k', 'u', 's', 'p'].includes(key)) ||
      (e.altKey && ['f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12'].includes(key))
    ) {
      e.preventDefault()
      e.stopPropagation()
      e.stopImmediatePropagation()
      return false
    }
  }

  // Capture phase to block before anything else
  document.addEventListener('keydown', blockKeys, true)
  window.addEventListener('keydown', blockKeys, true)

  // Block right-click everywhere
  const blockContextMenu = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    e.stopImmediatePropagation()
    return false
  }
  document.addEventListener('contextmenu', blockContextMenu, true)
  window.addEventListener('contextmenu', blockContextMenu, true)

  // Block text selection (optional - uncomment if you want)
  // document.addEventListener('selectstart', (e) => e.preventDefault(), true)

  // Block drag
  document.addEventListener('dragstart', (e) => e.preventDefault(), true)

  // Fast DevTools detection loop
  const detectDevTools = () => {
    // Method 1: Window size difference
    const widthThreshold = 100
    const heightThreshold = 100
    const widthDiff = window.outerWidth - window.innerWidth
    const heightDiff = window.outerHeight - window.innerHeight

    if (widthDiff > widthThreshold || heightDiff > heightThreshold) {
      redirectToBlank()
      return
    }

    // Method 2: Debugger timing
    const start = performance.now()
    debugger
    const end = performance.now()

    if (end - start > 50) {
      redirectToBlank()
      return
    }

    // Method 3: Console.log timing (detects if console is open)
    const before = performance.now()
    console.log('')
    const after = performance.now()
    if (after - before > 10) {
      redirectToBlank()
    }
  }

  // Very frequent checks
  setInterval(detectDevTools, 500)
  
  // Also check on mouse move and click
  document.addEventListener('mousemove', detectDevTools, true)
  document.addEventListener('click', detectDevTools, true)
  document.addEventListener('scroll', detectDevTools, true)

  // Redirect function
  function redirectToBlank() {
    // Clear page content first
    document.body.innerHTML = ''
    document.documentElement.innerHTML = ''
    
    // Then redirect
    window.location.replace('about:blank')
    
    // Fallback
    setTimeout(() => {
      window.open('', '_self')
      window.close()
    }, 100)
  }

  // Kill console
  const killConsole = () => {
    Object.defineProperty(window, 'console', {
      get: () => ({
        log: () => {},
        warn: () => {},
        error: () => {},
        info: () => {},
        debug: () => {},
        table: () => {},
        trace: () => {},
        dir: () => {},
        dirxml: () => {},
        group: () => {},
        groupEnd: () => {},
        time: () => {},
        timeEnd: () => {},
        timeLog: () => {},
        assert: () => {},
        clear: () => {},
        count: () => {},
        countReset: () => {},
        groupCollapsed: () => {},
        Console: () => {},
        profile: () => {},
        profileEnd: () => {},
        timeStamp: () => {},
        context: () => {},
      }),
      set: () => {},
      configurable: false,
    })
  }

  // Apply console kill
  killConsole()
}