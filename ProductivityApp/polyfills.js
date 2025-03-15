// Polyfill for ReadableStream
if (typeof global.ReadableStream === 'undefined') {
  const { Readable } = require('stream');
  
  global.ReadableStream = class ReadableStream {
    constructor(underlyingSource) {
      this._readable = new Readable({
        read() {}
      });
      
      if (underlyingSource && typeof underlyingSource.start === 'function') {
        const controller = {
          enqueue: (chunk) => {
            this._readable.push(chunk);
          },
          close: () => {
            this._readable.push(null);
          },
          error: (err) => {
            this._readable.emit('error', err);
          }
        };
        
        underlyingSource.start(controller);
      }
    }
    
    getReader() {
      const stream = this._readable;
      let closed = false;
      
      return {
        read() {
          return new Promise((resolve, reject) => {
            if (closed) {
              resolve({ done: true });
              return;
            }
            
            stream.once('data', (chunk) => {
              resolve({ value: chunk, done: false });
            });
            
            stream.once('end', () => {
              closed = true;
              resolve({ done: true });
            });
            
            stream.once('error', (err) => {
              reject(err);
            });
          });
        },
        releaseLock() {
          // Not implemented
        },
        cancel() {
          closed = true;
          return Promise.resolve();
        }
      };
    }
  };
} 