export default function DesignTestPage() {
  return (
    <div className="p-8 space-y-8">
      <section>
        <h1>Design System Test</h1>
        <p className="text-text-secondary">
          Testing Archer design system implementation
        </p>
      </section>

      {/* Colors */}
      <section className="space-y-4">
        <h2>Colors</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 bg-primary rounded text-white">Primary</div>
          <div className="p-4 bg-secondary rounded">Secondary</div>
          <div className="p-4 bg-accent-success rounded text-white">
            Success
          </div>
          <div className="p-4 bg-accent-warning rounded text-white">
            Warning
          </div>
          <div className="p-4 bg-accent-error rounded text-white">Error</div>
          <div className="p-4 bg-accent-info rounded text-white">Info</div>
        </div>
      </section>

      {/* Typography */}
      <section className="space-y-4">
        <h2>Typography</h2>
        <h1>Heading 1 - 32px</h1>
        <h2>Heading 2 - 30px</h2>
        <h3>Heading 3 - 24px</h3>
        <h4>Heading 4 - 20px</h4>
        <h5>Heading 5 - 18px</h5>
        <h6>Heading 6 - 16px</h6>
        <p>Body text - 16px regular</p>
        <p className="text-sm">Small text - 14px</p>
        <p className="text-xs">Extra small - 12px</p>
      </section>

      {/* Spacing */}
      <section className="space-y-4">
        <h2>Spacing (8px grid)</h2>
        <div className="space-y-2">
          <div className="h-1 w-1 bg-primary"></div>
          <div className="h-2 w-2 bg-primary"></div>
          <div className="h-3 w-3 bg-primary"></div>
          <div className="h-4 w-4 bg-primary"></div>
        </div>
      </section>

      {/* Shadows */}
      <section className="space-y-4">
        <h2>Shadows</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 bg-bg-white rounded shadow-sm">Shadow SM</div>
          <div className="p-4 bg-bg-white rounded shadow">Shadow Base</div>
          <div className="p-4 bg-bg-white rounded shadow-md">Shadow MD</div>
          <div className="p-4 bg-bg-white rounded shadow-lg">Shadow LG</div>
        </div>
      </section>
    </div>
  );
}
