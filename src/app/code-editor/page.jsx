"use client";
import React, { useState, useEffect, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";

const CodeEditor = () => {
  const [htmlCode, setHtmlCode] = useState("<h1>Hello World</h1>");
  const [cssCode, setCssCode] = useState("h1 { color: blue; }");
  const [jsCode, setJsCode] = useState("// JavaScript goes here");
  const [selectedTab, setSelectedTab] = useState("HTML");
  const [terminalOutput, setTerminalOutput] = useState("");
  const iframeRef = useRef(null);

  useEffect(() => {
    const savedHtml = localStorage.getItem("htmlCode");
    const savedCss = localStorage.getItem("cssCode");
    const savedJs = localStorage.getItem("jsCode");
    if (savedHtml) setHtmlCode(savedHtml);
    if (savedCss) setCssCode(savedCss);
    if (savedJs) setJsCode(savedJs);
  }, []);

  const saveCode = () => {
    localStorage.setItem("htmlCode", htmlCode);
    localStorage.setItem("cssCode", cssCode);
    localStorage.setItem("jsCode", jsCode);
    alert("Code saved!");
  };

  const updateIframeContent = () => {

    setTerminalOutput("");

    const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
    const completeContent = `
      <html>
        <head>
          <style>${cssCode}</style>
        </head>
        <body>
          ${htmlCode}
          <script>
            // Override console.log to send messages to parent window
            console.log = function(message) {
              window.parent.postMessage({ type: 'log', message: message }, '*');
            };

            // Capture errors and send to terminal
            window.onerror = function(message, source, lineno, colno, error) {
              window.parent.postMessage({ type: 'error', message: message }, '*');
              return true; // Prevent default error handling
            };

            try {
              ${jsCode}
            } catch (error) {
              // Capture any errors and send to terminal
              window.parent.postMessage({ type: 'error', message: error.message }, '*');
            }
          </script>
        </body>
      </html>
    `;
    iframeDoc.open();
    iframeDoc.write(completeContent);
    iframeDoc.close();
  };

  const handleTerminalMessage = (event) => {
    if (event.data.type === 'log') {
      setTerminalOutput((prev) => prev + event.data.message + '\n');
    } else if (event.data.type === 'error') {
      setTerminalOutput((prev) => prev + `Error: ${event.data.message}\n`);
    }
  };

  useEffect(() => {
    window.addEventListener('message', handleTerminalMessage);
    return () => {
      window.removeEventListener('message', handleTerminalMessage);
    };
  }, []);


  useEffect(() => {
    updateIframeContent();
  }, [htmlCode, cssCode, jsCode]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="p-4 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-semibold mb-4 text-center">Your Real-Time Coding Playground</h1>

        {/* Tab Buttons */}
        <div className="flex justify-center space-x-4 mb-4">
          {["HTML", "CSS", "JavaScript"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-2 rounded ${
                selectedTab === tab ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
              } hover:bg-blue-500 hover:text-white transition-colors`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Editors */}
        <div className="mb-4">
          {selectedTab === "HTML" && (
            <CodeMirror
              value={htmlCode}
              height="200px"
              extensions={[html()]}
              onChange={(value) => setHtmlCode(value)}
              className="border border-gray-300 rounded"
            />
          )}
          {selectedTab === "CSS" && (
            <CodeMirror
              value={cssCode}
              height="200px"
              extensions={[css()]}
              onChange={(value) => setCssCode(value)}
              className="border border-gray-300 rounded"
            />
          )}
          {selectedTab === "JavaScript" && (
            <CodeMirror
              value={jsCode}
              height="200px"
              extensions={[javascript()]}
              onChange={(value) => setJsCode(value)}
              className="border border-gray-300 rounded"
            />
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-center space-x-4 mb-4">
          <button onClick={updateIframeContent} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Run Code
          </button>
          <button onClick={saveCode} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
            Save Code
          </button>
        </div>

        {/* Terminal Output Panel */}
        <div className="bg-gray-900 text-white p-4 rounded-lg mb-4 h-48 overflow-y-auto">
          <h2 className="text-lg font-medium mb-2">Terminal Output</h2>
          <pre className="whitespace-pre-wrap">{terminalOutput}</pre>
        </div>

        {/* Live HTML + CSS Preview */}
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <iframe ref={iframeRef} title="Live Preview" className="w-full h-64"></iframe>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;