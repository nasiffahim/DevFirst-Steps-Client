'use client'
import { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import { Zap, Github, Star, GitFork, Code, TrendingUp, AlertCircle, Loader2, ExternalLink, Plus, Brain, User } from 'lucide-react'

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
                const response = await fetch(`http://localhost:5000/single_user?emailParams=${email}`);
                const data = await response.json();
                const userSkills = data.skills || [];
                setSkills(userSkills);
                
                // Fetch matching projects if skills exist
                if (userSkills.length > 0) {
                    await fetchMatchingProjects(userSkills);
                } else {
                    // Stop loading if no skills found
                    setLoading(false);
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
            const response = await fetch(`http://localhost:5000/skill_matcher?skills=${skillsParam}`);
            const data = await response.json();
            setProjects(data.projects || []);
        } catch (err) {
            console.error('Error fetching projects:', err);
            setError('Failed to fetch matching projects');
        } finally {
            setLoading(false);
        }
    };

    const handleAddSkills = () => {
        if (!user) {
            window.location.href = '/login';
        } else {
            window.location.href = '/dashboard/profile';
        }
    };

    const handleExploreProjects = () => {
        window.location.href = '/projects';
    };

    const handleViewDetails = (projectId) => {
        window.location.href = `/projects/${projectId}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8 sm:mb-12">
                    <div className="flex flex-col items-center text-center mb-6">
                        <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl shadow-2xl mb-4">
                            <Zap className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-3">
                            Skill Matcher
                        </h1>
                        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                            Discover projects that match your expertise
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center">
                        <button
                            onClick={handleAddSkills}
                            className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                        >
                            <Plus className="w-5 h-5" />
                            <span>{skills.length > 0 ? 'Manage Skills' : 'Add Skills'}</span>
                        </button>
                        <button
                            onClick={handleExploreProjects}
                            className="flex items-center justify-center gap-2 px-8 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700"
                        >
                            <TrendingUp className="w-5 h-5" />
                            <span>Explore All Projects</span>
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                        <p className="text-gray-600 dark:text-gray-400 text-lg">Finding matching projects...</p>
                    </div>
                )}

                {/* Not Logged In State */}
                {!user && !loading && (
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg p-8 sm:p-12 text-center border border-blue-100 dark:border-gray-600">
                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-md">
                                <User className="w-12 h-12 sm:w-16 sm:h-16 text-blue-500" />
                            </div>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                            Login to Discover Projects
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto text-sm sm:text-base">
                            Sign in to find amazing projects that match your skills and expertise!
                        </p>
                        <button
                            onClick={() => window.location.href = '/login'}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                        >
                            <User className="w-5 h-5" />
                            <span>Login Now</span>
                        </button>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                            <p className="text-red-800 dark:text-red-300">{error}</p>
                        </div>
                    </div>
                )}

                {!loading && (
                    <>
                        {/* Skills Section */}
                        {user && skills.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-2 mb-4">
                                    <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
                                        Your Skills
                                    </h2>
                                    <span className="ml-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
                                        {skills.length}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill, index) => (
                                        <span 
                                            key={index}
                                            className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm sm:text-base font-medium border border-blue-200 dark:border-blue-800 hover:shadow-md transition-shadow duration-200"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* No Skills State */}
                        {user && skills.length === 0 && !loading && (
                            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-lg p-8 sm:p-12 text-center border border-blue-100 dark:border-gray-600">
                                <div className="flex justify-center mb-6">
                                    <div className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-md">
                                        <Brain className="w-12 h-12 sm:w-16 sm:h-16 text-blue-500" />
                                    </div>
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                                    No Skills Added Yet
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto text-sm sm:text-base">
                                    Add your skills to discover exciting projects that match your expertise and interests!
                                </p>
                                <button
                                    onClick={handleAddSkills}
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span>Add Your Skills Now</span>
                                </button>
                            </div>
                        )}

                        {/* Matching Projects Section */}
                        {user && projects.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-6">
                                    <Github className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
                                        Matching Projects
                                    </h2>
                                    <span className="ml-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-semibold">
                                        {projects.length} found
                                    </span>
                                </div>
                                
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                    {projects.map((project) => (
                                        <div 
                                            key={project.id}
                                            className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-600 group relative overflow-hidden"
                                        >
                                            {/* Animated background gradient */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            
                                            <div className="relative z-10">
                                                <div className="flex items-start justify-between mb-3">
                                                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 flex-1 pr-2">
                                                        {project.full_name}
                                                    </h3>
                                                    {project.language && (
                                                        <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-semibold rounded-full">
                                                            {project.language}
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm sm:text-base line-clamp-2 min-h-[3rem]">
                                                    {project.description || 'No description available'}
                                                </p>
                                                
                                                <div className="flex flex-wrap gap-3 mb-4 text-xs sm:text-sm">
                                                    <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                        <span className="font-semibold">{project.stargazers_count.toLocaleString()}</span>
                                                    </span>
                                                    <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                                                        <GitFork className="w-4 h-4 text-blue-500" />
                                                        <span className="font-semibold">{project.forks_count.toLocaleString()}</span>
                                                    </span>
                                                    {/* <span className="text-gray-500 dark:text-gray-500 text-xs">
                                                        10/11/2025
                                                    </span> */}
                                                </div>

                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleViewDetails(project.id)}
                                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 dark:hover:from-blue-600 dark:hover:to-purple-700 text-gray-700 dark:text-gray-300 hover:text-white rounded-lg transition-all duration-300 text-sm font-medium border border-gray-200 dark:border-gray-600 hover:border-transparent"
                                                    >
                                                        <span>View Details</span>
                                                        <svg
                                                            className="w-4 h-4"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M9 5l7 7-7 7"
                                                            />
                                                        </svg>
                                                    </button>
                                                    <a
                                                        href={project.html_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-center p-2.5 bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 text-white rounded-lg transition-all duration-200 border border-gray-700 dark:border-gray-600"
                                                        title="View on GitHub"
                                                    >
                                                        <Github className="w-5 h-5" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer Message */}
                                <div className="mt-8 text-center">
                                    <div className="inline-block bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 border border-blue-100 dark:border-gray-600 shadow-md">
                                        <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base mb-3">
                                            ✨ These are the <span className="font-bold text-blue-600 dark:text-blue-400">top projects</span> that match your skillset!
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                                            You can try them out or{' '}
                                            <button
                                                onClick={handleExploreProjects}
                                                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                                            >
                                                explore more from our all projects section
                                            </button>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* No Projects Found State */}
                        {!loading && projects.length === 0 && skills.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 sm:p-12 text-center border border-gray-200 dark:border-gray-700">
                                <div className="flex justify-center mb-6">
                                    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
                                        <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 dark:text-gray-500" />
                                    </div>
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                                    No Matching Projects Found
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto text-sm sm:text-base">
                                    We couldn't find any projects matching your current skills. Try exploring all projects or updating your skill set!
                                </p>
                                <button
                                    onClick={handleExploreProjects}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                                >
                                    <TrendingUp className="w-5 h-5" />
                                    <span>Explore All Projects</span>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}