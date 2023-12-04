import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { marked } from 'marked';

const socket = io('http://localhost:3001');

function App() {
  const [markdown, setMarkdown] = useState('');
  const [html, setHtml] = useState('');

  useEffect(() => {
    // Listen for HTML changes
    socket.on('html', (data) => {
      setHtml(data)
      console.log(html);

    });

    // useEffect(() => {
    //   socket.on('change', (change) => {
    //     setData([...data, change]);
    //   });
    // }, [data]);
    
    return () => {
      // Cleanup when component unmounts
      socket.disconnect();
    };
  }, []);

  const handleMarkdownChange = (e) => {
    const newMarkdown = e.target.value;
    setMarkdown(newMarkdown);

    // Emit markdown changes to the server
    socket.emit('markdown', newMarkdown);
  };

  return (
    <div className="App">
      <div>
        <textarea
          placeholder="Type your markdown here..."
          value={markdown}
          onChange={handleMarkdownChange}
        />
      </div>
      <div>
        <h2>Live Preview</h2>
        <div dangerouslySetInnerHTML={{ __html: marked(markdown) }} />
        <div dangerouslySetInnerHTML={{ __html: html }}></div>
      </div>
    </div>
  );
}

export default App;
