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
  const [statusMessage, setStatusMessage] = useState('Ready to generate your GitHub portfolio 🚀');
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

{/* Header + Stepper Row */}
<div
  style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '30px'
  }}
>
  {/* PortfolioForge AI Header */}
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      marginBottom: '15px'
    }}
  >
    <div
      style={{
        width: '38px',
        height: '38px',
        background: '#2563eb',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: '700',
        marginRight: '10px'
      }}
    >
      🚀
    </div>

    <span
      style={{
        fontSize: '25px',
        fontWeight: '750',
        color: '#111827'
      }}
    >
      PortfolioForge AI
    </span>
  </div>

  <div
  style={{
    position: 'relative',
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    columnGap: '40px',
    width: '520px',
    marginLeft: 'auto',
    marginBottom: '40px'
  }}
>
  {/* connecting line */}
  <div
    style={{
      position: 'absolute',
      top: '20px',
      left: '65px',
      right: '65px',
      height: '2px',
      background: '#e5e7eb',
      zIndex: 0
    }}
  />

  {[
    'Profile',
    'Connect GitHub',
    'Add Projects',
    'Preview & Publish'
  ].map((step, index) => (
    <div
      key={step}
      style={{
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
        whiteSpace: 'nowrap'
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
</div>


        {/*<h1 style={{ fontSize: '52px', marginBottom: '10px', textAlign: 'center' }}>PortfolioForge AI</h1>
        <p style={{ fontSize: '20px', color: '#555', textAlign: 'center', marginBottom: '32px' }}>
          Generate professional GitHub portfolios from Colaberry projects.
        </p>
        */}

      {currentStep === 1 && (
        <div style={sectionStyle}>
<div style={{ textAlign: 'left', marginBottom: '30px' }}>
  <span
    style={{
      background: '#4f46e5',
      color: 'white',
      padding: '6px 12px',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '700'
    }}
  >

    
    STEP 1
  </span>

  <h2
    style={{
      marginTop: '18px',
      marginBottom: '10px',
      fontSize: '28px',
      fontWeight: '700'
    }}
  >
    Tell us about yourself 👋
  </h2>

  <p
    style={{
      color: '#64748b',
      fontSize: '15px',
      lineHeight: '1.6',
      margin: 0
    }}
  >
    This information will appear on your generated portfolio
  </p>
</div>
          <div style={{ marginBottom: '18px' }}>
  <label
  style={{
    display: 'block',
    textAlign: 'left',
    marginBottom: '8px',
    fontWeight: '700',
    fontSize: '15px',
    color: '#111827'
  }}
>
  Full Name
</label>

  <input
    style={inputStyle}
    placeholder="Enter your full name"
    value={fullName}
    onChange={(e) => setFullName(e.target.value)}
    style={{
        width: '100%',
        boxSizing: 'border-box',
        height: '48px',
        paddingLeft: '48px',
        border: '1px solid #dcdcde',
        boxShadow: '0 0 0 3px rgba(79,70,229,0.15)',
        borderRadius: '12px',
        fontSize: '16px',
        outline: 'none'
      }}
  />
</div>

<div style={{ marginBottom: '18px' }}>
  <label
    style={{
      display: 'block',
      textAlign: 'left',
      marginBottom: '8px',
      fontWeight: '700',
      fontSize: '15px',
      color: '#111827'
    }}
  >
    Professional Title
  </label>

  <input
    style={inputStyle}
    placeholder="e.g. Power BI Developer"
    value={professionalTitle}
    onChange={(e) => setProfessionalTitle(e.target.value)}
    style={{
        width: '100%',
        boxSizing: 'border-box',
        height: '48px',
        paddingLeft: '48px',
        border: '1px solid #dcdcde',
        boxShadow: '0 0 0 3px rgba(79,70,229,0.15)',
        borderRadius: '12px',
        fontSize: '16px',
        outline: 'none'
      }}
  />
</div>

<div style={{ marginBottom: '18px' }}>
  <label
    style={{
      display: 'block',
      textAlign: 'left',
      marginBottom: '8px',
      fontWeight: '700',
      fontSize: '15px',
      color: '#111827'
    }}
  >
    LinkedIn URL
  </label>

  <input
    style={inputStyle}
    placeholder="https://linkedin.com/in/yourprofile"
    value={linkedinUrl}
    onChange={(e) => setLinkedinUrl(e.target.value)}
    style={{
        width: '100%',
        boxSizing: 'border-box',
        height: '48px',
        paddingLeft: '48px',
        border: '1px solid #dcdcde',
        boxShadow: '0 0 0 3px rgba(79,70,229,0.15)',
        borderRadius: '12px',
        fontSize: '16px',
        outline: 'none'
      }}
  />
</div>

<div style={{ marginBottom: '18px' }}>
  <label
    style={{
      display: 'block',
      textAlign: 'left',
      marginBottom: '8px',
      fontWeight: '700',
      fontSize: '15px',
      color: '#111827'
    }}
  >
    Email Address
  </label>

  <input
    style={inputStyle}
    placeholder="you@example.com"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    style={{
        width: '100%',
        boxSizing: 'border-box',
        height: '48px',
        paddingLeft: '48px',
        border: '1px solid #dcdcde',
        boxShadow: '0 0 0 3px rgba(79,70,229,0.15)',
        borderRadius: '12px',
        fontSize: '16px',
        outline: 'none'
      }}
  />
</div>
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
<div
  style={{
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '24px'
  }}
>

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
            Continue →
          </button>
        </div></div>
      )}

{currentStep === 2 && (
  <div style={sectionStyle}>
    <div style={{ textAlign: 'left', marginBottom: '28px' }}>

  <span
    style={{
      background: '#4f46e5',
      color: 'white',
      padding: '6px 12px',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '700'
    }}
  >
    STEP 2
  </span>

  <h2
    style={{
      marginTop: '18px',
      marginBottom: '10px',
      fontSize: '28px',
      fontWeight: '700'
    }}
  >
    Connect your GitHub 🐙
  </h2>

  <p
    style={{
      color: '#64748b',
      fontSize: '15px',
      lineHeight: '1.6',
      maxWidth: '500px'
    }}
  >
    Connect GitHub to create your portfolio
  </p>

</div>

<div
  style={{
    background: githubConnected ? '#dcfce7' : '#fef3c7',
    border: githubConnected ? '1px solid #22c55e' : '1px solid #f59e0b',
    color: githubConnected ? '#166534' : '#92400e',
    padding: '16px',
    borderRadius: '10px',
    marginBottom: '16px',
    textAlign: 'center'
  }}
>
  {githubConnected ? (
    <>
      <div style={{ fontWeight: '700', fontSize: '18px' }}>
        ✅ GitHub connected successfully
      </div>

      <div
        style={{
          fontSize: '14px',
          marginTop: '4px'
        }}
      >
        Connected as {connectedUsername}
      </div>
    </>
  ) : (
    'GitHub not connected'
  )}
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

    <div style={{ marginBottom: '24px' }}>

  <label
    style={{
      display: 'block',
      textAlign: 'left',
      marginBottom: '10px',
      fontWeight: '700',
      fontSize: '16px',
      color: '#111827'
    }}
  >
    Portfolio Repository Name
  </label>

  <div style={{ position: 'relative' }}>
    <span
      style={{
        position: 'absolute',
        left: '16px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#9ca3af',
        fontSize: '18px'
      }}
    >
    </span>
    <input
      value={repoName}
      onChange={(e) => setRepoName(e.target.value)}
      placeholder="Repository name "
      style={{
        width: '100%',
        boxSizing: 'border-box',
        height: '48px',
        paddingLeft: '48px',
        border: '1px solid #dcdcde',
        boxShadow: '0 0 0 3px rgba(79,70,229,0.15)',
        borderRadius: '12px',
        fontSize: '16px',
        outline: 'none'
      }}
    />
  </div>
</div>
<p
  style={{
    color: '#64748b',
    fontSize: '14px',
    marginTop: '8px',
    textAlign: 'left'
  }}
>
  This repository will be created or updated with your generated portfolio.
</p>
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
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '24px',
        maxWidth: '850px',
        margin: '24px auto 0 auto'
      }}
    >  
      <button
        style={backButtonStyle}
        onClick={() => setCurrentStep(1)}
      >
        ← Back
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
  Continue →
</button>
    </div>
  </div>
)}

{currentStep === 3 && (
  <div style={sectionStyle}>
    <div
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  }}
>
  <div style={{ textAlign: 'left' }}>
    <span
      style={{
        background: '#4f46e5',
        color: 'white',
        padding: '6px 12px',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '700'
      }}
    >
      STEP 3
    </span>

    <h2
  style={{
    marginTop: '18px',
    marginBottom: '10px',
    fontSize: '28px',
    fontWeight: '700'
  }}
>
  Colaberry Project Links 🔗
</h2>

    <p
    style={{
      color: '#64748b',
      fontSize: '15px',
      lineHeight: '1.6',
      maxWidth: '500px'
    }}
  >
      Add up to 3 project links and we’ll analyze them to build your portfolio
    </p>
  </div>


</div>
<div style={{ width: '100%', margin: '0 auto' }}>

    <div style={{ marginBottom: '18px' }}>
  <label
  style={{
    display: 'block',
    textAlign: 'left',
    marginBottom: '10px',
    fontWeight: '700',
    fontSize: '18px',
    letterSpacing: '-0.2px',
    color: '#111827'
  }}
>
    Project Link 1
  </label>

  <div style={{ position: 'relative' }}>
    <span
      style={{
        position: 'absolute',
        left: '14px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#9ca3af'
      }}
    >
      🔗
    </span>

    <input
      type="text"
      placeholder="https://app.colaberry.com/..."
      value={projectLink1}
      onChange={(e) => setProjectLink1(e.target.value)}
      style={{
        width: '100%',
        boxSizing: 'border-box',
        height: '48px',
        paddingLeft: '42px',
        border: '1px solid #dcdcde',
        boxShadow: '0 0 0 3px rgba(79,70,229,0.15)',
        borderRadius: '8px',
        fontSize: '15px',
        outline: 'none'
      }}
    />
  </div>
</div>

    <div style={{ marginBottom: '18px' }}>
  <label
  style={{
    display: 'block',
    textAlign: 'left',
    marginBottom: '10px',
    fontWeight: '700',
    fontSize: '18px',
    letterSpacing: '-0.2px',
    color: '#111827'
  }}
>
    Project Link 2
     <span
    style={{
      fontWeight: '400',
      fontSize: '14px',
      color: '#6b7280',
      marginLeft: '6px'
    }}
  >
    (Optional)
  </span>
  </label>

  <div style={{ position: 'relative' }}>
    <span
      style={{
        position: 'absolute',
        left: '14px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#9ca3af'
      }}
    >
      🔗
    </span>

    <input
      type="text"
      placeholder="https://app.colaberry.com/..."
      value={projectLink2}
      onChange={(e) => setProjectLink2(e.target.value)}
      style={{
        width: '100%',
        boxSizing: 'border-box',
        height: '48px',
        paddingLeft: '42px',
        border: '1px solid #dcdcde',
        boxShadow: '0 0 0 3px rgba(79,70,229,0.15)',
        borderRadius: '8px',
        fontSize: '15px',
        outline: 'none'
      }}
    />
  </div>
</div>

    <div style={{ marginBottom: '18px' }}>
  <label
  style={{
    display: 'block',
    textAlign: 'left',
    marginBottom: '10px',
    fontWeight: '700',
    fontSize: '18px',
    letterSpacing: '-0.2px',
    color: '#111827'
  }}
>
    Project Link 3
  <span
    style={{
      fontWeight: '400',
      fontSize: '14px',
      color: '#6b7280',
      marginLeft: '6px'
    }}
  >
    (Optional)
  </span>
  </label>

  <div style={{ position: 'relative' }}>
    <span
      style={{
        position: 'absolute',
        left: '14px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#9ca3af'
      }}
    >
      🔗
    </span>

    <input
      type="text"
      placeholder="https://app.colaberry.com/..."
      value={projectLink3}
      onChange={(e) => setProjectLink3(e.target.value)}
      style={{
        width: '100%',
        boxSizing: 'border-box',
        height: '48px',
        paddingLeft: '42px',
        border: '1px solid #dcdcde',
        boxShadow: '0 0 0 3px rgba(79,70,229,0.15)',
        borderRadius: '8px',
        fontSize: '15px',
        outline: 'none'
      }}
    />
  </div>
</div>
</div>
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
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '24px',
        maxWidth: '850px',
        margin: '24px auto 0 auto'
      }}
    >
      <button
        style={backButtonStyle}
        onClick={() => setCurrentStep(2)}
      >
       ← Back
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
  Preview & Publish →
</button>
    </div>
  </div>
)}

{currentStep === 4 && (
  <div style={sectionStyle}>
    <div style={{ textAlign: 'left', marginBottom: '30px' }}>

  <span
    style={{
      background: '#4f46e5',
      color: 'white',
      padding: '6px 12px',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '700'
    }}
  >
    STEP 4
  </span>

  <h2
    style={{
      marginTop: '18px',
      marginBottom: '10px',
      fontSize: '28px',
      fontWeight: '700'
    }}
  >
    Review & Generate ✨
  </h2>

  <p
    style={{
      color: '#64748b',
      fontSize: '15px',
      lineHeight: '1.6',
      margin: 0
    }}
  >
    Review your information and projects before generating your portfolio
  </p>

</div>
<div
  style={{
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px',
    maxWidth: '850px',
    margin: '20px auto'
  }}
>
  <div
    style={{
      background: '#f8fafc',
      border: '1px solid #e5e7eb',
      borderRadius: '14px',
      padding: '24px',
      textAlign: 'left',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    }}
  >
    <h3 style={{ marginTop: 0, marginBottom: '18px', color: '#111827' }}>
  Your Information
</h3>

<div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#374151' }}>
  <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '12px' }}>
    <span>👤 Name</span>
    <strong>{fullName || 'Not provided'}</strong>
  </div>

  <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '12px' }}>
    <span>💼 Title</span>
    <strong>{professionalTitle || 'Not provided'}</strong>
  </div>
  
  <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '12px' }}>
    <span>📧 Email</span>
    <strong>{email || 'Not provided'}</strong>
  </div>

  <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '12px' }}>
    <span>🔗 LinkedIn</span>
    <strong>{linkedinUrl || 'Not provided'}</strong>
  </div>
  
  <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '12px' }}>
    <span>🐙 GitHub</span>
    <strong>{githubUsername || 'Not provided'}</strong>
  </div>

  <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '12px' }}>
    <span>📁 Repository</span>
    <strong>{repoName || 'Not provided'}</strong>
  </div>
</div>
  </div>

  <div
    style={{
      background: '#f8fafc',
      border: '1px solid #e5e7eb',
      borderRadius: '14px',
      padding: '24px',
      textAlign: 'left',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    }}
  >
    <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#111827' }}>
      Selected Projects
    </h3>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', color: '#374151' }}>
      {[projectLink1, projectLink2, projectLink3]
        .filter(Boolean)
        .map((link, index) => (
          <div key={index}>🔗 Project {index + 1}</div>
        ))}
    </div>
  </div>
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

    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '24px',
        maxWidth: '850px',
        margin: '24px auto 0 auto'
      }}
    >
      <button
       style={{
         ...backButtonStyle,
         opacity: isGenerating || statusMessage.includes('Portfolio generated successfully') ? 0.5 : 1,
         cursor: isGenerating || statusMessage.includes('Portfolio generated successfully') ? 'not-allowed' : 'pointer'
       }}
       disabled={isGenerating || statusMessage.includes('Portfolio generated successfully')}
       onClick={() => setCurrentStep(3)}
      >
      ← Back
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
          : 'Generate Portfolio🚀'}
      </button>
    </div>
  </div>
)}
      </div>
    </div>
  );
}

export default App;