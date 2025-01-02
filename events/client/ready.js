module.exports = async (client) => {
	console.log(`Logged in as ${client.user.tag}!`);

	await client.user.setPresence({ 
		activities: [{ name: `Made by: Anusara Bemal`, type: 2 }], 
		status: 'online', 
	});
}
