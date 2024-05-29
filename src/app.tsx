import React, { useEffect, useState } from 'react';

import { DashboardBox } from './components/dashboard-box';
import { DashboardList } from './components/dashboard-list';
import './app.css';

interface Event {
  id: number;
  projectId: number;
  name: string;
  page: string;
  createdAt: string;
}

interface Project {
  id: number;
  name: string;
}

const API_URL = 'https://83.249.98.222/api';
// const API_URL = 'http://localhost:8080';

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showProjectInput, setShowProjectInput] = useState(false);
  const [projectInputValue, setProjectInputValue] = useState('');
  const [selectedProject, setSelectedProject] = useState<string>();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchEventList(selectedProject);
    }
  }, [selectedProject]);

  const fetchProjects = () => {
    fetch(`${API_URL}/project`)
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error('Error fetching projects:', error));
  };

  const addProject = () => {
    fetch(`${API_URL}/project`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: projectInputValue }),
    })
      .then((response) => response.json())
      .then((data) => {
        setProjects([...projects, data]);
        setSelectedProject(data.id.toString());
        setShowProjectInput(false);
        setProjectInputValue('');
      })
      .catch((error) => console.error('Error creating project:', error));
  };

  const fetchEventList = (projectId: string) => {
    fetch(`${API_URL}/event/${projectId}`)
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error('Error fetching event list:', error));
  };

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProject(e.target.value);
  };

  const handleAddProjectClick = () => {
    setShowProjectInput(true);
  };

  const handleProjectInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectInputValue(e.target.value);
  };

  const handleProjectInputSubmit = () => {
    if (projectInputValue) {
      addProject();
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center sm:h-screen">
      <select
        value={selectedProject}
        onChange={handleProjectChange}
        className="m-4 rounded-md border border-gray-300 p-2"
      >
        <option value="">Select project</option>
        {projects.map((project, index) => (
          <option key={index} value={project.id.toString()}>
            {project.name}
          </option>
        ))}
      </select>
      <svg
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-6 w-6 cursor-pointer "
        onClick={handleAddProjectClick}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
      {showProjectInput && (
        <div>
          <input
            type="text"
            className="m-4 rounded-md border border-gray-300 p-2"
            value={projectInputValue}
            onChange={handleProjectInputChange}
          />
          <button onClick={handleProjectInputSubmit}>Add</button>
        </div>
      )}
      {selectedProject && events && (
        <>
          <DashboardBox title="Total pageviews" number={events.length} />
          <DashboardList events={events} />
        </>
      )}
    </div>
  );
}

export default App;
