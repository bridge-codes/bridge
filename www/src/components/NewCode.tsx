import React, {memo} from "react"
import Highlight, { defaultProps } from 'prism-react-renderer';
import theme from 'prism-react-renderer/themes/nightOwl';

export const NewCustomCode = ({
  code,
  highlighedLines = [],
  showLineNumber = false,
  hiddenLines = [],
}: {
  code: string;
  highlighedLines?: Array<number>;
  showLineNumber?: boolean;
  hiddenLines?: Array<number>;
}) => {
  return (
    <Highlight {...defaultProps} theme={theme} code={code} language={'typescript'}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={className}
          style={{
            padding: '0px 0px',
            marginBottom: 8,
            background: 'transparent',
          }}
        >
          {tokens.map((line, i) => (
          <NewCustomCodeLineMemo line={line} showLineNumber={showLineNumber} lineNumber={i + 1} getLineProps={getLineProps} getTokenProps={getTokenProps} hide={hiddenLines.includes(i + 1)} highlight={highlighedLines.includes(i + 1)}/>
          ))}
        </pre>
      )}
    </Highlight>
  );
};


const NewCustomCodeLine = ({line, showLineNumber, lineNumber, getLineProps, getTokenProps, hide, highlight}:
  {
    line: any;
    lineNumber: number;
    showLineNumber: boolean;
    getLineProps: any;
    getTokenProps: any;
    hide: boolean;
    highlight: boolean
  }
) => {

  return(
          <div className="transition-all duration-700" 
          style={{ 
                display: 'block', 
                opacity: hide ? 0 : 1,
                maxHeight: hide ? 0 : 24,
                background: highlight ? "rgb(255, 255, 255, 0.04)" : "rgb(255, 255, 255, 0)",
                borderLeftStyle: "solid",
                borderLeftWidth: 4,
                borderLeftColor: highlight ? "#A175FF" : "rgb(255,255,255,0)",
                overflowY: "hidden",
          }}>
          {showLineNumber &&
            <div
              style={{
                fontSize: 14,
                display: 'table-cell',
                textAlign: 'right',
                userSelect: 'none',
                opacity: 0.5,
                paddingRight: '1em',
                paddingLeft: '0.5em',
              }}
            >
              {lineNumber + 1}
            </div>
          }
            <div style={{ 
                display: 'inline-table', 
                width: "100%", 
                fontSize: '14px',
                padding: "2px 20px"
            }}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </div>
          </div>
  )

}

const NewCustomCodeLineMemo = memo(NewCustomCodeLine)