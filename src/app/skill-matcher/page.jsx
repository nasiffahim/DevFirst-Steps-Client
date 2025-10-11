'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import useAuth from '../hooks/useAuth'

export default function SkillMatcher() {
    const { user } = useAuth();
    const email = user?.email;
    
    const [skills, setSkills] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserSkills = async () => {
            if (!email) return;
            
            setLoading(true);
            setError(null);
            
            try {
                const response = await axios.get(`http://localhost:5000/single_user?emailParams=${email}`);
                const userSkills = response.data.skills || [];
                setSkills(userSkills);
                
                // Fetch matching projects if skills exist
                if (userSkills.length > 0) {
                    await fetchMatchingProjects(userSkills);
                }
            } catch (err) {
                console.error('Error fetching user skills:', err);
                setError('Failed to fetch user data');
                setLoading(false);
            }
        };

        fetchUserSkills();
    }, [email]);

    const fetchMatchingProjects = async (userSkills) => {
        try {
            const skillsParam = userSkills.join(',');
            const response = await axios.get(`http://localhost:5000/skill_matcher?skills=${skillsParam}`);
            setProjects(response.data.projects || []);
        } catch (err) {
            console.error('Error fetching projects:', err);
            setError('Failed to fetch matching projects');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Skill Matcher</h1>
            
            {loading && <p className="text-gray-600">Loading...</p>}
            {error && <p className="text-red-600">{error}</p>}
            
            {skills.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-3">Your Skills:</h2>
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                            <span 
                                key={index}
                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}
            
            {projects.length > 0 && (
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Matching Projects:</h2>
                    <div className="grid gap-4">
                        {projects.map((project) => (
                            <div 
                                key={project.id}
                                className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
                            >
                                <h3 className="text-lg font-semibold text-blue-600 mb-2">
                                    <a 
                                        href={project.html_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="hover:underline"
                                    >
                                        {project.full_name}
                                    </a>
                                </h3>
                                <p className="text-gray-700 mb-3">
                                    {project.description || 'No description available'}
                                </p>
                                <div className="flex gap-4 text-sm text-gray-600">
                                    <span>⭐ {project.stargazers_count.toLocaleString()} stars</span>
                                    <span>🍴 {project.forks_count.toLocaleString()} forks</span>
                                    {project.language && (
                                        <span className="px-2 py-0.5 bg-gray-100 rounded">
                                            {project.language}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {!loading && projects.length === 0 && skills.length > 0 && (
                <p className="text-gray-600">No matching projects found.</p>
            )}
        </div>
    )
}