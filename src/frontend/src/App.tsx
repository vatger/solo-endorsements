import './App.css';

import { Card } from 'primereact/card';
import React, { useState, useEffect } from 'react';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

function App() {
  const [redirectTimer, setRedirectTimer] = useState(5);

  const navigateToCoreVateud = () => {
    window.location.href = 'https://core.vateud.net';
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      navigateToCoreVateud();
    }, 5000);

    // Cleanup the timer on component unmount
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const timerId = setInterval(() => {
      setRedirectTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    // Cleanup the timer on component unmount
    return () => clearInterval(timerId);
  }, []);

  const cardFooter = (
    <div>
      <p>
        This site is deprecated. Please use{' '}
        <strong>
          <a href='https://core.vateud.net' style={{ color: '#007BFF', textDecoration: 'none', fontWeight: 'bold' }}>
            core.vateud.net
          </a>
        </strong>{' '}
        instead. Redirecting in {redirectTimer} seconds.
      </p>
    </div>
  );

  const cardStyle = { width: '300px', margin: 'auto', marginTop: '50px' };

  return (
    <>
      <div className="p-d-flex p-jc-center p-ai-center" style={{ height: '100vh' }}>
        <Card title="Deprecated Site" subTitle="The functionality of this site is now being covered in core.vateud.net" style={cardStyle}>
          {cardFooter}
        </Card>
      </div>
    </>
  );
}

export default App;
