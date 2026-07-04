import { useState, useEffect } from 'react';

function App() {
  const [fullName, setFullName] = useState('');
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [email, setEmail] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [repoName, setRepoName] = useState('');
  const [portfolioMode, setPortfolioMode] = useState('create');

  const [githubConnected, setGithubConnected] = useState(false);
  const [connectedUsername, setConnectedUsername] = useState('');

  const [projectLinks, setProjectLinks] = useState(['']);
  const [loadedStudent, setLoadedStudent] = useState(null);
  const [loadedProjects, setLoadedProjects] = useState([]);
  const [selectedProjectLinks, setSelectedProjectLinks] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  
  const MAX_PROJECT_LINKS = 10;

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
    portfolioMode,
    
    projectLinks: selectedProjectLinks.filter(Boolean)
  };

  if (!githubUsername || !githubConnected || !repoName) {
    setStatusMessage('Please connect GitHub and enter a repository name.');
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
  height: '52px',
  padding: '0 16px',
  fontSize: '15px',
  color: '#111827',

  border: '1px solid #d1d5db',

  borderRadius: '10px',

  background: '#ffffff',

  boxSizing: 'border-box',

  transition: 'all .2s ease',

  outline: 'none',

  boxShadow: '0 1px 3px rgba(0,0,0,.04)'
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

  const handleInputFocus = (e) => {
    e.target.style.border = '1px solid #4f46e5';
    e.target.style.boxShadow = '0 0 0 4px rgba(79,70,229,.15)';
  };

  const handleInputBlur = (e) => {
    e.target.style.border = '1px solid #d1d5db';
    e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,.04)';
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

      {currentStep === 1 && (
  <div style={sectionStyle}>
    <div style={{ textAlign: 'left', marginBottom: '30px' }}>
      <span style={{
        background: '#4f46e5',
        color: 'white',
        padding: '6px 12px',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '700'
      }}>
        STEP 1
      </span>

      <h2 style={{ marginTop: '18px', marginBottom: '10px', fontSize: '28px', fontWeight: '700' }}>
        Connect Colaberry Account 👋
      </h2>

      <p style={{ color: '#64748b', fontSize: '15px', lineHeight: '1.6' }}>
        Log into Colaberry so PortfolioForge can load your profile and projects automatically.
      </p>
    </div>

  {!loadedStudent && (
    <button
      style={{ ...nextButtonStyle, marginBottom: '20px' }}
      disabled={isLoadingProjects}
      onClick={async () => {
        setIsLoadingProjects(true);
        setErrorMessage('');

        try {
          const response = await fetch('http://localhost:3001/api/colaberry/load-portfolio-data');
          const data = await response.json();

          if (!data.found) {
            setErrorMessage('Could not load your Colaberry profile.');
            return;
          }

          setLoadedStudent(data.student);
          const loadedProjectLinks = (data.projects || []).map(project => project.projectLink);

          setLoadedProjects(data.projects || []);
          setSelectedProjectLinks(loadedProjectLinks);

          setFullName(`${data.student.FirstName} ${data.student.LastName}`);
          setEmail(data.student.Email);
          setProjectLinks(loadedProjectLinks);
        } catch (error) {
          console.error(error);
          setErrorMessage('Failed to connect to Colaberry.');
        } finally {
          setIsLoadingProjects(false);
        }
      }}
    >
      {isLoadingProjects ? 'Loading Colaberry Data...' : 'Connect Colaberry'}
    </button>
  )}
  
    {loadedStudent && (
      <>
        <div style={{
          background: '#ecfdf5',
          border: '1px solid #86efac',
          color: '#166534',
          padding: '14px',
          borderRadius: '10px',
          marginBottom: '20px',
          fontWeight: '600'
        }}>
          ✅ Colaberry profile loaded: {loadedStudent.FirstName} {loadedStudent.LastName}
          <br />
          Projects found: {loadedProjects.length}
        </div>

        <label
          style={{
            display: 'block',
            textAlign: 'left',
            marginBottom: '8px',
            marginTop: '18px',
            fontWeight: '700',
            fontSize: '16px',
            color: '#111827'
          }}
         >
           Full Name <span style={{ color: '#dc2626' }}>*</span>
        </label>
       <input
  value={fullName}
  onChange={(e) => setFullName(e.target.value)}
  style={inputStyle}
  onFocus={(e) => {
    e.target.style.border = '1px solid #4f46e5';
    e.target.style.boxShadow = '0 0 0 4px rgba(79,70,229,.15)';
  }}
  onBlur={(e) => {
    e.target.style.border = '1px solid #d1d5db';
    e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,.04)';
  }}
/>

        <label
          style={{
          display: 'block',
          textAlign: 'left',
          marginBottom: '8px',
          marginTop: '18px',
          fontWeight: '700',
          fontSize: '16px',
          color: '#111827'
        }}
       >
         Email <span style={{ color: '#dc2626' }}>*</span>
        </label>
        <input
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  style={inputStyle}
  onFocus={(e) => {
    e.target.style.border = '1px solid #4f46e5';
    e.target.style.boxShadow = '0 0 0 4px rgba(79,70,229,.15)';
  }}
  onBlur={(e) => {
    e.target.style.border = '1px solid #d1d5db';
    e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,.04)';
  }}
/>

        <label
          style={{
          display: 'block',
          textAlign: 'left',
          marginBottom: '8px',
          marginTop: '18px',
          fontWeight: '700',
          fontSize: '16px',
          color: '#111827'
        }}
      >
         Professional Title <span style={{ color: '#dc2626' }}>*</span>
        </label>
        <input
  value={professionalTitle}
  onChange={(e) => setProfessionalTitle(e.target.value)}
  style={inputStyle}
  onFocus={(e) => {
    e.target.style.border = '1px solid #4f46e5';
    e.target.style.boxShadow = '0 0 0 4px rgba(79,70,229,.15)';
  }}
  onBlur={(e) => {
    e.target.style.border = '1px solid #d1d5db';
    e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,.04)';
  }}
/>

        <label
  style={{
    display: 'block',
    textAlign: 'left',
    marginBottom: '8px',
    marginTop: '18px',
    fontWeight: '700',
    fontSize: '16px',
    color: '#111827'
  }}
>
  LinkedIn URL
  <span
    style={{
      color: '#64748b',
      fontWeight: '400',
      marginLeft: '6px'
    }}
  >
    (Optional)
  </span>
</label>
        <input
  value={linkedinUrl}
  onChange={(e) => setLinkedinUrl(e.target.value)}
  style={inputStyle}
  onFocus={(e) => {
    e.target.style.border = '1px solid #4f46e5';
    e.target.style.boxShadow = '0 0 0 4px rgba(79,70,229,.15)';
  }}
  onBlur={(e) => {
    e.target.style.border = '1px solid #d1d5db';
    e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,.04)';
  }}
/>
      </>
    )}

    {errorMessage && (
      <p style={{ color: '#dc2626', fontWeight: '600', textAlign: 'center' }}>
        {errorMessage}
      </p>
    )}

    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
      <button
        style={nextButtonStyle}
        onClick={() => {
          if (!loadedStudent) {
            setErrorMessage('Please connect your Colaberry account first.');
            return;
          }
          if (
             !fullName.trim() ||
             !email.trim() ||
             !professionalTitle.trim()
          ) {
             setErrorMessage(
                'Please complete all required fields before continuing.'
            );
            return;
            }
          setErrorMessage('');
          setCurrentStep(2);
        }}
      >
        Continue →
      </button>
    </div>
  </div>
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
        Connect GitHub 🐙
      </h2>

      <p
        style={{
          color: '#64748b',
          fontSize: '15px',
          lineHeight: '1.6',
          maxWidth: '550px'
        }}
      >
        Connect your GitHub account so PortfolioForge can create or update your portfolio repository.
      </p>
    </div>

    <div
      style={{
        background: githubConnected ? '#dcfce7' : '#fef3c7',
        border: githubConnected ? '1px solid #22c55e' : '1px solid #f59e0b',
        color: githubConnected ? '#166534' : '#92400e',
        padding: '16px',
        borderRadius: '10px',
        marginBottom: '20px',
        textAlign: 'left',
        fontWeight: '600'
      }}
    >
      {githubConnected ? (
        <>
          ✅ GitHub connected successfully
          <br />
          <span style={{ fontWeight: '500' }}>
            Connected as {connectedUsername}
          </span>
        </>
      ) : (
        'GitHub is not connected yet.'
      )}
    </div>

    {!githubConnected && (
      <button
        style={{
          ...nextButtonStyle,
          marginBottom: '24px'
        }}
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
        Connect GitHub Account
      </button>
    )}

   <div
  style={{
    border: '1px solid #dbe3ef',
    borderRadius: '12px',
    padding: '18px',
    marginBottom: '24px',
    background: '#ffffff'
  }}
>
  <h3
    style={{
      margin: '0 0 6px 0',
      fontSize: '17px',
      color: '#111827',
      textAlign: 'left'
    }}
  >
    Repository Selection
  </h3>

  <p
    style={{
      margin: '0 0 18px 0',
      color: '#64748b',
      fontSize: '14px',
      textAlign: 'left'
    }}
  >
    Choose whether to create a new GitHub repository or update an existing one.
  </p>

  <label
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '14px',
      cursor: 'pointer',
      fontWeight: '700'
    }}
  >
    <input
      type="radio"
      checked={portfolioMode === 'create'}
      onChange={() => {
        setPortfolioMode('create');
        setRepoName('');
      }}
    />
    Create a new repository
  </label>

  {portfolioMode === 'create' && (
    <>
      <label
        style={{
          display: 'block',
          textAlign: 'left',
          marginBottom: '8px',
          fontWeight: '700',
          fontSize: '16px',
          color: '#111827'
        }}
      >
        New Repository Name <span style={{ color: '#dc2626' }}>*</span>
      </label>

      <input
        value={repoName}
        onChange={(e) => setRepoName(e.target.value)}
        placeholder="e.g. kalkidan-portfolio"
        style={inputStyle}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
      />
    </>
  )}

  <label
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginTop: '20px',
      marginBottom: '14px',
      cursor: 'pointer',
      fontWeight: '700'
    }}
  >
    <input
      type="radio"
      checked={portfolioMode === 'update'}
      onChange={() => {
        setPortfolioMode('update');
        setRepoName('');
      }}
    />
    Update an existing repository
  </label>

  {portfolioMode === 'update' && (
    <>
      <label
        style={{
          display: 'block',
          textAlign: 'left',
          marginBottom: '8px',
          fontWeight: '700',
          fontSize: '16px',
          color: '#111827'
        }}
      >
        Existing Repository Name <span style={{ color: '#dc2626' }}>*</span>
      </label>

      <input
        value={repoName}
        onChange={(e) => setRepoName(e.target.value)}
        placeholder="Enter existing repository name"
        style={inputStyle}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
      />

      <p
        style={{
          marginTop: '8px',
          fontSize: '13px',
          color: '#64748b',
          textAlign: 'left'
        }}
      >
        Enter the GitHub repository name you want PortfolioForge to update.
      </p>
    </>
  )}
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
        marginTop: '24px'
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
    <div style={{ textAlign: 'left', marginBottom: '24px' }}>
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

      <h2 style={{ marginTop: '18px', marginBottom: '10px', fontSize: '28px', fontWeight: '700' }}>
        My Colaberry Projects 📂
      </h2>

      <p style={{ color: '#64748b', fontSize: '15px', lineHeight: '1.6' }}>
        Load your real Colaberry projects from the database and choose which ones to include.
      </p>
    </div>

    {loadedStudent && (
      <div
        style={{
          background: '#ecfdf5',
          border: '1px solid #86efac',
          color: '#166534',
          padding: '14px',
          borderRadius: '10px',
          marginBottom: '18px',
          fontWeight: '600'
        }}
      >
        ✅ Loaded profile: {loadedStudent.FirstName} {loadedStudent.LastName} — {loadedStudent.Email}
      </div>
    )}

    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {loadedProjects.map((project, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '16px',
            background: '#ffffff'
          }}
        >
          <input
  type="checkbox"
  checked={selectedProjectLinks.includes(project.projectLink)}
  onChange={(e) => {
    if (e.target.checked) {
      setSelectedProjectLinks([...selectedProjectLinks, project.projectLink]);
    } else {
      setSelectedProjectLinks(
        selectedProjectLinks.filter(link => link !== project.projectLink)
      );
    }
  }}
          />
          {project.imageUrl && (
            <img
              src={project.imageUrl}
              alt={project.title}
              style={{
                width: '90px',
                height: '56px',
                objectFit: 'cover',
                borderRadius: '6px',
                border: '1px solid #e5e7eb'
              }}
            />
          )}

          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '700', color: '#111827', fontSize: '14px', lineHeight: '1.35' }}>
              {project.title}
            </div>

            <div style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>
              {project.summary ? project.summary.slice(0, 120) + '...' : 'Loaded from Colaberry database'}
            </div>
          </div>
        </div>
      ))}
    </div>

    {errorMessage && (
      <p style={{ color: '#dc2626', marginTop: '16px', fontWeight: '600', textAlign: 'center' }}>
        {errorMessage}
      </p>
    )}

    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
      <button style={backButtonStyle} onClick={() => setCurrentStep(2)}>
        ← Back
      </button>

      <button
        style={nextButtonStyle}
        onClick={() => {
          if (selectedProjectLinks.length === 0) {
            setErrorMessage('Please select at least one project to include.');
            return;
          }

          setErrorMessage('');
          setCurrentStep(4);
        }}
      >
        Continue to Preview →
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
    gridTemplateColumns: '36% 1fr',
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

<div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

  {[
    ['👤', 'Name', fullName || 'Not provided'],
    ['💼', 'Title', professionalTitle || 'Not provided'],
    ['📧', 'Email', email || 'Not provided'],
    ['🔗', 'LinkedIn', linkedinUrl || 'Not provided'],
    ['🐙', 'GitHub', githubUsername || 'Not provided'],
    ['📁', 'Repository', repoName || 'Not provided']
  ].map(([icon, label, value]) => (

    <div
      key={label}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px'
      }}
    >

      <span
        style={{
          fontSize: '14px',
          marginTop: '2px',
          width: '18px',
          textAlign: 'center'
        }}
      >
        {icon}
      </span>

      <div style={{ flex: 1 }}>

        <div
          style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#6b7280',
            lineHeight: '1.2'
          }}
        >
          {label}
        </div>

        <div
          style={{
            marginTop: '3px',
            fontSize: '15px',
            fontWeight: '700',
            color: '#111827',
            lineHeight: '1.4'
          }}
        >
          {value}
        </div>

      </div>

    </div>

  ))}

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

<div style={{ display: 'flex', flexDirection: 'column', gap: '14px', color: '#374151', width: '100%' }}>
  {loadedProjects.map((project, index) => (
    <div
      key={index}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        border: '1px solid #e5e7eb',
        borderRadius: '10px',
        padding: '12px',
        background: '#ffffff',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      {project.imageUrl && (
        <img
          src={project.imageUrl}
          alt={project.title}
          style={{
            width: '72px',
            height: '46px',
            objectFit: 'cover',
            borderRadius: '6px',
            border: '1px solid #e5e7eb'
          }}
        />
      )}

      <div>
        <div style={{ fontWeight: '700', color: '#111827', fontSize: '14px', lineHeight: '1.35'}}>
          {project.title}
        </div>

        <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
          Loaded from Colaberry database
        </div>
      </div>
    </div>
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