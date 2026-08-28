export const downloadPDF = async (name: string) => {
	const pdf: Blob = await fetch('/api/generate-pdf', {
		method: 'POST',
		body: JSON.stringify({
			url: location.href,
			filename: name,
		}),
	}).then((data) => data.blob());

	const pdfURL = URL.createObjectURL(pdf);

	const currentYear: number = new window.Date().getFullYear();
	const filename = `${name}-${currentYear}.pdf`;
	const link = document.createElement('a');
	link.href = pdfURL;
	link.download = filename;
	link.dispatchEvent(new MouseEvent('click'));

	URL.revokeObjectURL(pdfURL);
};
