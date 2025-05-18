import React, { useEffect, useState } from 'react';
import Button from '../../components/general/Button.jsx';
import TeamMemberCard from '../../components/general/TeamMemberCard.jsx';

const users = {
	"biancacasetta": {
		linkedin: "https://www.linkedin.com/in/bianca-casetta/",
		role: "Database, User API & Recent Trades"
	},
	"SvenLindstrom": {
		linkedin: "",
		role: "Auth API, Architecture & Admin Panel"
	},
	"SchwarzNikolas": {
		linkedin: "https://www.linkedin.com/in/nikolas-schwarz-a32a48309",
		role: "Stocks API, Responsive Design & Dashboard"
	},
	"tableba": {
		linkedin: "https://www.linkedin.com/in/antoine-geiger-384538311",
		role: "Frontend Structure & Trading Page"
	},
	"StackedFrog": {
		linkedin: "https://www.linkedin.com/in/isaac-prins-a9b61330a/",
		role: "Design, Cookie Auth & Account Page"
	}
}

function About({userInfo}) {
	const [githubUsers, setGithubUsers] = useState([]);

	useEffect(() => {
		async function fetchUsers() {
			const fetchedUsers = await Promise.all(
				Object.keys(users).map(u =>
					fetch(`https://api.github.com/users/${u}`).then(res => res.json())
				)
			);
			setGithubUsers(fetchedUsers);
		}
		fetchUsers();
	}, []);

	return (
		<div className='min-h-screen bg-background flex flex-col items-center gap-5 py-15 lg:py-20'>
			<div className='w-[80%] sm:w-[60%] lg:w-[40%] text-center sm:flex sm:flex-col sm:items-center'>
				<p className='text-text font-text pb-2'>
					<span className='font-heading'>MOCK STOCKS</span> is a project developed for the Full-Stack Development course
					taught during the 2025 Spring semester at Kristianstad University for the Software Development
					Bachelor's programme.
				</p>
				{!userInfo && <Button text="Back to Home" to="/" className='sm:w-[40%]'/>}
				
			</div>
			<div className='flex flex-col items-center'>
				<h2 className='font-heading text-secondary text-3xl py-5'>OUR STACK</h2>
				<div className='flex flex-col sm:flex-row items-center w-[90%]'>
					<div className='flex flex-col items-center w-full'>
						<h3 className='font-heading text-primary text-2xl'>FRONTEND</h3>
						<div className='w-[75%] flex justify-center flex-wrap gap-3 py-5 sm:w-[70%] sm:justify-center'>
							<div className='text-6xl text-accent'>
								<i className="devicon-html5-plain"></i>
							</div>
							<div className='text-6xl text-accent'>
								<i className="devicon-tailwindcss-original"></i>
							</div>
							<div className='text-6xl text-accent'>
								<i className="devicon-react-original"></i>
							</div>
							<div className='text-6xl text-accent'>
								<i className="devicon-vitejs-plain"></i>
							</div>
							<div className='text-6xl text-accent'>
								<i className="devicon-javascript-plain"></i>
							</div>
						</div>
					</div>

					<div className='flex flex-col items-center w-full'>
						<h3 className='font-heading text-primary text-2xl'>BACKEND</h3>
						<div className='flex flex-wrap justify-center gap-3 w-[75%] py-5'>
							<div className='text-6xl text-accent'>
								<i className="devicon-rust-original"></i>
							</div>
							<div className='text-6xl text-accent'>
								<i className="devicon-redis-plain"></i>
							</div>
							<div className='text-6xl text-accent'>
								<i className="devicon-oauth-plain"></i>
							</div>
							<div className='text-6xl text-accent'>
								<i className="devicon-opentelemetry-plain"></i>
							</div>
							<div className='text-6xl text-accent'>
								<i className="devicon-postgresql-plain"></i>
							</div>
							<div className='text-6xl text-accent'>
								<i className="devicon-docker-plain"></i>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className='flex flex-col items-center'>
				<h1 className='font-heading text-secondary text-center text-3xl my-10'>MEET THE TEAM</h1>
				<div className='flex flex-col max-w-[1200px] sm:flex-row sm:w-[80%] sm:flex-wrap sm:justify-center items-center gap-7'>
					{githubUsers.map(u => (
						<TeamMemberCard
							avatarUrl={u.avatar_url}
							githubUrl={u.html_url}
							displayName={u.name || u.login}
							linkedinUrl={users[u.login].linkedin}
							role={users[u.login].role}
						></TeamMemberCard>
					))}
				</div>
			</div>
		</div>
	)
}

export default About;
