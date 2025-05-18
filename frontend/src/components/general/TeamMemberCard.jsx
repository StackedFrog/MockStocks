const TeamMemberCard = ({ avatarUrl, githubUrl, displayName, linkedinUrl, role}) => {

	return (
		<div className="w-[90%] max-w-[275px] flex flex-col gap-5 items-center bg-primary py-[3vh] rounded-lg">
			<img src={avatarUrl} alt={`${displayName}'s profile picture`}
				className="w-[75%] rounded-full border-accent border-8" />
			<div className="text-center w-[90%]">
				<h2 className="font-text text-secondary text-2xl">{displayName}</h2>
				<span className="font-text">{role}</span>
			</div>
			<div className="flex gap-5">
				<a href={githubUrl} target="_blank" className="text-accent text-5xl hover:text-secondary
                 active:text-secondary transition-colors duration:200">
					<i className="devicon-github-original"></i>
				</a>
				{linkedinUrl && (
					<a href={linkedinUrl} target="_blank" className="text-accent text-5xl hover:text-secondary
                     active:text-secondary transition-colors duration:200">
						<i className="devicon-linkedin-plain"></i>
					</a>
				)}
			</div>
		</div>
	)
};

export default TeamMemberCard;
