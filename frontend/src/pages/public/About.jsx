import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import Button from '../../components/ui/Button.jsx';
import TeamMemberCard from '../../components/ui/TeamMemberCard.jsx';

const usernames = ["biancacasetta", "SvenLindstrom", "SchwarzNikolas", "tableba", "StackedFrog"];
const linkedins = {
	"biancacasetta" : "https://www.linkedin.com/in/bianca-casetta/",
	"SvenLindstrom" : "",
	"SchwarzNikolas" : "https://www.linkedin.com/in/nikolas-schwarz-a32a48309",
	"tableba" : "https://www.linkedin.com/in/antoine-geiger-384538311",
	"StackedFrog" : "https://www.linkedin.com/in/isaac-prins-a9b61330a"
}

function About() {
	const [users, setUsers] = useState([]);

	useEffect(() => {
		async function fetchUsers() {
			const fetchedUsers = await Promise.all(
				usernames.map(u => 
					fetch(`https://api.github.com/users/${u}`).then(res => res.json())
				)
			);
			setUsers(fetchedUsers);
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
				<Button text="Back to Home" to="/" className='sm:w-[40%]'></Button>
			</div>
			<div className='flex flex-col items-center'>
				<h2 className='font-heading text-secondary text-3xl py-5'>OUR STACK</h2>
				<div className='flex flex-col sm:flex-row items-center w-[90%]'>
					<div className='flex flex-col items-center w-full'>
						<h3 className='font-heading text-primary text-2xl'>FRONTEND</h3>
						<div className='flex flex-wrap gap-3 py-5 sm:w-[70%] sm:justify-center'>
							<div className='text-6xl text-accent'>
								<i class="devicon-html5-plain"></i>
							</div>
							<div className='text-6xl text-accent'>
								<i class="devicon-tailwindcss-original"></i>
							</div>
							<div className='text-6xl text-accent'>
								<i class="devicon-react-original"></i>
							</div>
							<div className='text-6xl text-accent'>
								<i class="devicon-vitejs-plain"></i>
							</div>
							<div className='text-6xl text-accent'>
								<i class="devicon-javascript-plain"></i>
							</div>
						</div>
					</div>

					<div className='flex flex-col items-center w-full'>
						<h3 className='font-heading text-primary text-2xl'>BACKEND</h3>
						<div className='flex flex-wrap gap-3 w-[60%] py-5'>
							<div className='text-6xl text-accent'>
								<i class="devicon-rust-original"></i>
							</div>
							<div className='text-6xl text-accent'>
								<i class="devicon-redis-plain"></i>
							</div>
							<div className='text-6xl text-accent'>
								<i class="devicon-oauth-plain"></i>
							</div>
							<div className='text-6xl text-accent'>
								<i class="devicon-opentelemetry-plain"></i>
							</div>
							<div className='text-6xl text-accent'>
								<i class="devicon-postgresql-plain"></i>
							</div>
							<div className='text-6xl text-accent'>
								<i class="devicon-docker-plain"></i>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className='flex flex-col items-center'>
				<h1 className='font-heading text-secondary text-center text-3xl my-10'>MEET THE TEAM</h1>
				<div className='flex flex-col max-w-[1200px] sm:flex-row sm:w-[80%] sm:flex-wrap sm:justify-center items-center gap-7'>
					{users.map(u => (
						<TeamMemberCard
							avatarUrl={u.avatar_url}
							githubUrl={u.html_url}
							displayName={u.name || u.login}
							linkedinUrl={linkedins[u.login]}
						></TeamMemberCard>
					))}
				</div>
			</div>
		</div>
	)
}

export default About;