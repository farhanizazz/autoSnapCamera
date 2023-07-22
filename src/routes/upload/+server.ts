import { writeFileSync } from 'fs';
import fs from 'fs';
import { Blob } from 'buffer';
import { API_KEY, CHAT_ID } from '$env/static/private';
import { page } from '$app/stores';

function blobToFile(theBlob, fileName){
	//A Blob() is almost a File() - it's just missing the two properties below which we will add
	theBlob.lastModifiedDate = new Date();
	theBlob.name = fileName;
	return theBlob;
  }

export async function POST({ request }) {
	const data = await request.json();
	const imageBase64 = data.meta + ',' + data.image;
	const bufferFile = Buffer.from(data.image, 'base64');

	writeFileSync(`static/image.png`, bufferFile, 'base64');
	writeFileSync(`static/text.txt`, imageBase64);
	
	const file = fs.readFileSync('static/image.png')
	const blobFile = new Blob([file], { type: "image/jpeg" })
	console.log(file);
	var data_tele = new FormData();
	data_tele.append('document', `${page.path}`);
	data_tele.append('caption', 'text');
	const response = await fetch(
		`https://api.telegram.org/bot${API_KEY}/sendDocument?chat_id=${CHAT_ID}`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'multipart/form-data',
				Accept: 'multipart/form-data'
			},
			body: data_tele
		}
	);
	console.log(data_tele);
	console.log(response.status);
	console.log(response.statusText);

	return new Response(JSON.stringify({ message: 'Some Message' }), { status: 200 });
}

// export const actions = {
// 	upload: async ({ request }) => {
// 		const data = await request.formData();
// 		console.log(data);
// 	}
// };
