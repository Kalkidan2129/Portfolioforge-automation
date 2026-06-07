import { useState, useEffect } from 'react';

function App() {
  const [fullName, setFullName] = useState('');
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [email, setEmail] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [repoName, setRepoName] = useState('');
  
  const [githubConnected, setGithubConnected] = useState(false);
  const [connectedUsername, setConnectedUsername] = useState('');

  const [projectLink1, setProjectLink1] = useState('');
  const [projectLink2, setProjectLink2] = useState('');
  const [projectLink3, setProjectLink3] = useState('');
  const [projectName1, setProjectName1] = useState('');
  const [projectName2, setProjectName2] = useState('');
  const [projectName3, setProjectName3] = useState('');
  const [statusMessage, setStatusMessage] = useState('No portfolio generated yet.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  
  useEffect(() => {
  fetch('http://localhost:3001/auth/github/status')
    .then((res) => res.json())
    .then((data) => {
      if (data.connected) {
        setGithubConnected(true);
        setConnectedUsername(data.username);
        setGithubUsername(data.username);
      }
    })
    .catch(() => {});
}, []);

  async function handleGeneratePortfolio() {
  const formData = {
    fullName,
    professionalTitle,
    linkedinUrl,
    email,
    githubUsername,
    repoName,
    
    projectLinks: [projectLink1, projectLink2, projectLink3].filter(Boolean)
  };

  if (!fullName || !githubUsername || !githubConnected || !repoName || !projectLink1) {
    setStatusMessage('Please enter your full name, connect GitHub, enter a repository name, and provide at least one project link.');
    return;
  }

  setIsGenerating(true);
  setStatusMessage('Sending request to PortfolioForge backend...');

  try {
    const response = await fetch('http://localhost:3001/generate-portfolio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    await response.json();

    setStatusMessage('Starting portfolio generation... Please complete Colaberry login in the opened browser.');

    const statusInterval = setInterval(async () => {
      try {
        const statusResponse = await fetch('http://localhost:3001/portfolio-status');
        const statusData = await statusResponse.json();

    if (statusData.completed) {
      setStatusMessage(`Portfolio generated successfully! View Portfolio: ${statusData.portfolioUrl}`);
      setIsGenerating(false);
      clearInterval(statusInterval);
  } else {
      setStatusMessage(statusData.step || 'Portfolio generation is running...');
    }
    } catch (error) {
    console.error(error);
    setStatusMessage('Unable to read portfolio generation status.');
    clearInterval(statusInterval);
    }
  }, 3000);

  } catch (error) {
    console.error(error);
    setStatusMessage('Failed to connect to backend.');
  } 
}

  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginBottom: '14px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontSize: '16px'
  };

  const sectionStyle = {
    background: '#ffffff',
    padding: '32px 36px',
    marginBottom: '24px',
    borderRadius: '14px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
  };

  const nextButtonStyle = {
    padding: '12px 24px',
    background: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer'
  };

  const backButtonStyle = {
    padding: '12px 24px',
    background: '#e5e7eb',
    color: '#111827',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    marginRight: '12px'
  };

  return (
    <div style={{ background: '#f5f7fb', minHeight: '100vh', padding: '56px 40px' }}>
      <div style={{ maxWidth: '850px', margin: '0 auto' }}>
        <div
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '30px',
    padding: '20px'
  }}
>
  {[
    'Student',
    'GitHub',
    'Projects',
    'Generate'
  ].map((step, index) => (
    <div
      key={step}
      style={{
        textAlign: 'center',
        flex: 1
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          margin: '0 auto',
          background:
            currentStep >= index + 1
              ? '#2563eb'
              : '#d1d5db',
          color: 'white',
          lineHeight: '40px',
          fontWeight: 'bold'
        }}
      >
        {currentStep > index + 1 ? '✓' : index + 1}
      </div>

      <div
        style={{
          marginTop: '8px',
          fontSize: '14px'
        }}
      >
        {step}
      </div>
    </div>
  ))}
</div>

<div
  style={{
    width: '100%',
    marginBottom: '25px'
  }}
>
  <div
    style={{
      background: '#e5e7eb',
      height: '10px',
      borderRadius: '999px',
      overflow: 'hidden'
    }}
  >
    <div
      style={{
        width:
          currentStep === 1
            ? '25%'
            : currentStep === 2
            ? '50%'
            : currentStep === 3
            ? '75%'
            : '100%',
        background: '#2563eb',
        height: '100%',
        transition: '0.3s'
      }}
    />
  </div>

  <p
    style={{
      textAlign: 'center',
      marginTop: '10px',
      fontWeight: '600',
      color: '#374151'
    }}
  >
    Step {currentStep} of 4
  </p>
</div>

        <h1 style={{ fontSize: '52px', marginBottom: '10px', textAlign: 'center' }}>PortfolioForge AI</h1>
        <p style={{ fontSize: '20px', color: '#555', textAlign: 'center', marginBottom: '32px' }}>
          Generate professional GitHub portfolios from Colaberry projects.
        </p>

      {currentStep === 1 && (
        <div style={sectionStyle}>
          <h2>Student Information</h2>
          <p style={{ color: '#666' }}>This information will appear on the generated portfolio.</p>
          <input style={inputStyle} placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <input style={inputStyle} placeholder="Professional Title" value={professionalTitle} onChange={(e) => setProfessionalTitle(e.target.value)} />
          <input style={inputStyle} placeholder="LinkedIn URL" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} />
          <input style={inputStyle} placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
{errorMessage && (
  <p
    style={{
      color: '#dc2626',
      marginBottom: '16px',
      fontWeight: '600',
      textAlign: 'center'
    }}
  >
    {errorMessage}
  </p>
)}
          <button
             style={nextButtonStyle}
             onClick={() => {
              if (!fullName || !professionalTitle) {
                setErrorMessage(
                  'Please enter your full name and professional title.'
                );
                return;
              }

              setErrorMessage('');
              setCurrentStep(2);

            }}
           >
            Next: GitHub Setup
          </button>
        </div>
      )}

{currentStep === 2 && (
  <div style={sectionStyle}>
    <h2>GitHub Setup</h2>

    <p style={{ color: '#666' }}>
      Used to create or update the portfolio repository.
    </p>

<div
  style={{
    background: githubConnected ? '#dcfce7' : '#fef3c7',
    border: githubConnected ? '1px solid #22c55e' : '1px solid #f59e0b',
    color: githubConnected ? '#166534' : '#92400e',
    padding: '14px',
    borderRadius: '10px',
    marginBottom: '16px',
    fontWeight: '600'
  }}
>
  {githubConnected
    ? `✓ Connected as ${connectedUsername}`
    : 'GitHub not connected'}
</div>

{!githubConnected && (
  <button
    style={nextButtonStyle}
    onClick={() => {
  window.open(
  'http://localhost:3001/auth/github',
  'githubOAuthPopup',
  'width=300,height=150,top=200,left=550,resizable=no'
);

  const checkConnection = setInterval(async () => {
    try {
      const res = await fetch('http://localhost:3001/auth/github/status');
      const data = await res.json();

      if (data.connected) {
        setGithubConnected(true);
        setConnectedUsername(data.username);
        setGithubUsername(data.username);

        clearInterval(checkConnection);
      }
    } catch (error) {
      console.error('GitHub connection check failed:', error);
    }
  }, 2000);
}}

  >
    Connect GitHub
  </button>
)}

    <input
      style={inputStyle}
      placeholder="Portfolio Repository Name"
      value={repoName}
      onChange={(e) => setRepoName(e.target.value)}
    />

    
{errorMessage && (
  <p
    style={{
      color: '#dc2626',
      marginBottom: '16px',
      fontWeight: '600',
      textAlign: 'center'
    }}
  >
    {errorMessage}
  </p>
)}
    <div>   
      <button
        style={backButtonStyle}
        onClick={() => setCurrentStep(1)}
      >
        Back
      </button>


<button
  style={nextButtonStyle}
  onClick={() => {
    if (!githubConnected || !repoName) {
      setErrorMessage('Please connect GitHub and enter a repository name.');
      return;
    }

    setErrorMessage('');
    setCurrentStep(3);
  }}
>
  Next: Project Links
</button>
    </div>
  </div>
)}

{currentStep === 3 && (
  <div style={sectionStyle}>
    <h2>Project Links</h2>

    <p style={{ color: '#666' }}>
      Add up to 3 Colaberry project links.
    </p>

    <input
      style={inputStyle}
      placeholder="Project Link 1"
      value={projectLink1}
      onChange={(e) => setProjectLink1(e.target.value)}
    />

    <input
      style={inputStyle}
      placeholder="Project Link 2"
      value={projectLink2}
      onChange={(e) => setProjectLink2(e.target.value)}
    />

    <input
      style={inputStyle}
      placeholder="Project Link 3"
      value={projectLink3}
      onChange={(e) => setProjectLink3(e.target.value)}
    />
{errorMessage && (
  <p
    style={{
      color: '#dc2626',
      marginBottom: '16px',
      fontWeight: '600',
      textAlign: 'center'
    }}
  >
    {errorMessage}
  </p>
)}
    <div>
      <button
        style={backButtonStyle}
        onClick={() => setCurrentStep(2)}
      >
        Back
      </button>

<button
  style={nextButtonStyle}
  onClick={() => {
    if (!projectLink1) {
      setErrorMessage('Please enter at least one Colaberry project link.');
      return;
    }

    setErrorMessage('');
    setCurrentStep(4);
  }}
>
  Review & Generate
</button>
    </div>
  </div>
)}

{currentStep === 4 && (
  <div style={sectionStyle}>
    <h2>Review & Generate</h2>

    <p style={{ color: '#666' }}>
      Review your information before generating the portfolio.
    </p>
<div
  style={{
    background: '#f8fafc',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '18px',
    margin: '18px auto 22px auto',
    maxWidth: '520px',
    textAlign: 'left',
    lineHeight: '1.8'
  }}>
    <p><strong>Name:</strong> {fullName || 'Not provided'}</p>
    <p><strong>Title:</strong> {professionalTitle || 'Not provided'}</p>
    <p><strong>GitHub Username:</strong> {githubUsername || 'Not provided'}</p>
    <p><strong>Repository:</strong> {repoName || 'Not provided'}</p>
    <p><strong>Projects Selected:</strong>{' '}
       {[projectLink1, projectLink2, projectLink3].filter(Boolean).length}</p>
  </div> 
{statusMessage && (
  <div
    style={{
      marginTop: '20px',
      marginBottom: '20px',
      padding: '16px',
      background: statusMessage.includes('Portfolio generated successfully') ? '#dcfce7' : '#eef2ff',
      border: statusMessage.includes('Portfolio generated successfully') ? '2px solid #22c55e' : 'none',
      borderRadius: '10px',
      color: statusMessage.includes('Portfolio generated successfully') ? '#166534' : '#374151',
      fontWeight: '600'
    }}
  >
    {statusMessage.includes('http') ? (
  <>
    Portfolio generated successfully!
    <br />
    <a
      href={statusMessage.match(/https?:\/\/\S+/)?.[0]}
      target="_blank"
      rel="noreferrer"
      style={{ color: '#2563eb', fontWeight: '700' }}
    >
      Open Portfolio
    </a>
  </>
) : (
  statusMessage
)}
  </div>
)}

    <div>
      <button
       style={{
         ...backButtonStyle,
         opacity: isGenerating || statusMessage.includes('Portfolio generated successfully') ? 0.5 : 1,
         cursor: isGenerating || statusMessage.includes('Portfolio generated successfully') ? 'not-allowed' : 'pointer'
       }}
       disabled={isGenerating || statusMessage.includes('Portfolio generated successfully')}
       onClick={() => setCurrentStep(3)}
      >
       Back
      </button>

      <button
        onClick={handleGeneratePortfolio}
        disabled={isGenerating || statusMessage.includes('Portfolio generated successfully')}
        style={{
          ...nextButtonStyle,
          background: isGenerating ? '#94a3b8' : '#2563eb',
          cursor: isGenerating ? 'not-allowed' : 'pointer'
        }}
      >
        {statusMessage.includes('Portfolio generated successfully')
          ? 'Portfolio Generated'
          : isGenerating
          ? 'Generating Portfolio...'
          : 'Generate Portfolio'}
      </button>
    </div>
  </div>
)}
      </div>
    </div>
  );
}

export default App;