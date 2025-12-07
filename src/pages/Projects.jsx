/**
 * Projects Page - View and manage all lyric projects
 */

import React, { useEffect } from 'react';
import ProjectDashboard from '../components/ui/ProjectDashboard';

const Projects = () => {
  useEffect(() => {
    document.title = 'My Projects | VRS/A';
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <ProjectDashboard />
      </div>
    </div>
  );
};

export default Projects;
