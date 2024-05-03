export const createGroup = async (user_id, searchResults) => {
	const response = await fetch(
		`https://locker-4eff66da6769.herokuapp.com/api/admin/createGroup/${user_id}`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
			},
			body: JSON.stringify({
				group_name: searchResults,
				user_id: user_id,
			}),
		}
	);
	return response;
};
