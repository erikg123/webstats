import React, { useEffect, useState } from 'react';

import { DashboardBox } from './components/dashboard-box';
import { DashboardList } from './components/dashboard-list';
import './app.css';

interface Event {
  id: number;
  projectId: number;
  name: string;
  page: string;
}

interface Project {
  id: number;
  name: string;
}

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
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
    fetch('http://localhost:8080/projects')
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error('Error fetching projects:', error));
  };

  const fetchEventList = (projectId: string) => {
    fetch(`http://localhost:8080/events?projectId=${projectId}`)
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error('Error fetching event list:', error));
  };

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProject(e.target.value);
  };

  return (
    <div className="flex flex-wrap items-center justify-center">
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
      <DashboardBox title="Total pageviews" number={events.length} />
      <DashboardList events={events} />
    </div>
  );
}

export default App;
