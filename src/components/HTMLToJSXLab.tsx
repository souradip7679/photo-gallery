import React, { useState, useMemo } from 'react';
import { Code2, ArrowRight, CheckCircle2, Sparkles, Copy, Check, Info, FileCode } from 'lucide-react';

const PRESET_EXAMPLES = [
  {
    name: 'Photo Card Snippet',
    html: `<div class="photo-card" style="border-radius: 12px; background-color: #1e1e2d;">\n  <!-- User Avatar & Header -->\n  <img src="avatar.jpg" alt="Author" class="avatar">\n  <h3 class="title">Sunset View</h3>\n  <br>\n  <button onclick="handleLike()" class="btn-like">Like Photo</button>\n</div>`,
  },
  {
    name: 'Search Form Control',
    html: `<form class="search-form" action="/search">\n  <label for="search-input">Search Gallery:</label>\n  <input type="text" id="search-input" placeholder="Type here..." autofocus>\n  <hr>\n  <input type="submit" value="Submit" disabled>\n</form>`,
  },
  {
    name: 'Interactive Alert Button',
    html: `<div class="alert-box" style="color: #ff4757; font-weight: bold;">\n  <!-- Warning message -->\n  <span>Attention Required!</span>\n  <button onclick="closeAlert()" style="margin-left: 10px;">Dismiss</button>\n</div>`,
  },
];

export const HTMLToJSXLab: React.FC = () => {
  const [htmlInput, setHtmlInput] = useState(PRESET_EXAMPLES[0].html);
  const [copied, setCopied] = useState(false);

  // Conversion Engine logic
  const conversionResult = useMemo(() => {
    let jsx = htmlInput;
    const rulesApplied: string[] = [];

    // 1. Replace class with className
    if (/\bclass=/g.test(jsx)) {
      jsx = jsx.replace(/\bclass=/g, 'className=');
      rulesApplied.push('Converted `class="..."` to `className="..."`');
    }

    // 2. Replace for with htmlFor
    if (/\bfor=/g.test(jsx)) {
      jsx = jsx.replace(/\bfor=/g, 'htmlFor=');
      rulesApplied.push('Converted `for="..."` to `htmlFor="..."`');
    }

    // 3. Convert onclick, onchange, etc. to camelCase onClick, onChange
    const eventRegex = /\b(on[a-z]+)=["']([^"']*)["']/gi;
    if (eventRegex.test(jsx)) {
      jsx = jsx.replace(eventRegex, (_, eventAttr, val) => {
        const camelEvent = 'on' + eventAttr.slice(2).charAt(0).toUpperCase() + eventAttr.slice(3).toLowerCase();
        return `${camelEvent}={() => ${val}}`;
      });
      rulesApplied.push('Converted inline HTML event handlers (`onclick`) to camelCase JSX handlers (`onClick={() => ...}`)');
    }

    // 4. Convert inline style string style="color: red; margin-top: 10px;" to style={{ color: 'red', marginTop: '10px' }}
    const styleRegex = /style=["']([^"']*)["']/g;
    if (styleRegex.test(jsx)) {
      jsx = jsx.replace(styleRegex, (_, styleString: string) => {
        const styleObjParts = styleString
          .split(';')
          .filter((s) => s.trim())
          .map((s) => {
            const [prop, val] = s.split(':');
            if (!prop || !val) return '';
            const camelProp = prop.trim().replace(/-([a-z])/g, (_, g) => g.toUpperCase());
            return `${camelProp}: '${val.trim()}'`;
          })
          .filter((s) => s);
        return `style={{ ${styleObjParts.join(', ')} }}`;
      });
      rulesApplied.push('Parsed inline string styles into JavaScript style objects (`style={{ key: "value" }}`)');
    }

    // 5. Self-close void elements: img, input, br, hr
    const voidTags = ['img', 'input', 'br', 'hr', 'meta', 'link'];
    voidTags.forEach((tag) => {
      const tagRegex = new RegExp(`<(${tag})([^>]*?)(?<!\\/)>`, 'gi');
      if (tagRegex.test(jsx)) {
        jsx = jsx.replace(tagRegex, `<$1$2 />`);
        rulesApplied.push(`Ensured self-closing tags for void element \`<${tag} />\``);
      }
    });

    // 6. Convert HTML comments <!-- comment --> to JSX {/* comment */}
    const commentRegex = /<!--\s*([\s\S]*?)\s*-->/g;
    if (commentRegex.test(jsx)) {
      jsx = jsx.replace(commentRegex, '{/* $1 */}');
      rulesApplied.push('Converted standard HTML comments `<!-- -->` to JSX syntax `{/* */}`');
    }

    // 7. Single word boolean attributes like disabled, autofocus, checked
    ['disabled', 'autofocus', 'checked', 'readonly', 'required'].forEach((attr) => {
      const attrRegex = new RegExp(`\\b${attr}\\b(?!=)`, 'gi');
      if (attrRegex.test(jsx)) {
        rulesApplied.push(`JSX supports shorthand boolean attribute \`${attr}\``);
      }
    });

    return {
      jsx,
      rulesApplied: Array.from(new Set(rulesApplied)),
    };
  }, [htmlInput]);

  const handleCopy = () => {
    navigator.clipboard.writeText(conversionResult.jsx);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="jsx-lab-container">
      {/* Header Banner */}
      <div className="lab-header">
        <div className="lab-title-group">
          <Code2 className="lab-icon" size={28} />
          <div>
            <h1>HTML → JSX Interactive Converter Lab</h1>
            <p>
              Learn and visualize how standard HTML markup transforms into React JSX syntax with live transformation rules.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="preset-examples-bar">
        <span className="preset-title"><FileCode size={16} /> Load Example HTML Snippets:</span>
        <div className="preset-buttons">
          {PRESET_EXAMPLES.map((ex, idx) => (
            <button
              key={idx}
              className="lab-preset-btn"
              onClick={() => setHtmlInput(ex.html)}
            >
              {ex.name}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Editor Grid */}
      <div className="lab-editor-grid">
        {/* Left Input: Raw HTML */}
        <div className="editor-card">
          <div className="editor-card-header">
            <span className="editor-badge html-badge">HTML Markup (Input)</span>
            <span className="editor-hint">Edit or paste raw HTML code below:</span>
          </div>
          <textarea
            className="code-textarea"
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
            placeholder="Type or paste standard HTML snippet..."
            rows={12}
          />
        </div>

        {/* Arrow Divider */}
        <div className="conversion-arrow">
          <ArrowRight size={24} />
        </div>

        {/* Right Output: Transformed JSX */}
        <div className="editor-card">
          <div className="editor-card-header">
            <span className="editor-badge jsx-badge">React JSX Output</span>
            <button className="copy-code-btn" onClick={handleCopy}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copied!' : 'Copy JSX'}</span>
            </button>
          </div>
          <pre className="code-output">
            <code>{conversionResult.jsx}</code>
          </pre>
        </div>
      </div>

      {/* Applied Rules Breakdown */}
      <div className="lab-rules-breakdown">
        <div className="rules-header">
          <Sparkles size={20} className="sparkle-icon" />
          <h3>Transformation Rules Applied ({conversionResult.rulesApplied.length})</h3>
        </div>

        {conversionResult.rulesApplied.length === 0 ? (
          <p className="no-rules-text">Your HTML markup already satisfies standard JSX syntax rules!</p>
        ) : (
          <ul className="rules-list">
            {conversionResult.rulesApplied.map((rule, index) => (
              <li key={index} className="rule-item">
                <CheckCircle2 size={16} className="rule-check" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Key Concept Cards */}
      <div className="jsx-key-concepts">
        <h3><Info size={18} /> Core Differences Between HTML and JSX</h3>
        <div className="concepts-grid">
          <div className="concept-card">
            <h4>1. Attribute Naming</h4>
            <p>
              JSX uses camelCase attribute names instead of HTML attribute names. For example, <code>class</code> becomes <code>className</code>, and <code>for</code> becomes <code>htmlFor</code>.
            </p>
          </div>

          <div className="concept-card">
            <h4>2. Inline Styling Objects</h4>
            <p>
              In HTML, styles are passed as strings. In JSX, styles are passed as JavaScript objects with camelCased property names (e.g. <code>style=&#123;&#123; backgroundColor: 'red' &#125;&#125;</code>).
            </p>
          </div>

          <div className="concept-card">
            <h4>3. Self-Closing Void Tags</h4>
            <p>
              In HTML5, elements like <code>&lt;img&gt;</code> or <code>&lt;input&gt;</code> don't require closing tags. In JSX, all void tags <strong>must</strong> be explicitly self-closed with <code>/&gt;</code>.
            </p>
          </div>

          <div className="concept-card">
            <h4>4. Event Handler Bindings</h4>
            <p>
              In HTML, event handlers take string expressions (<code>onclick="..."</code>). In JSX, event handlers take JavaScript function references (<code>onClick=&#123;handleClick&#125;</code>).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
