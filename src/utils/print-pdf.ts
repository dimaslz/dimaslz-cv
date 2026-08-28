import puppeteer, { type PaperFormat } from 'puppeteer';

type Params = {
	url: string;
	format?: PaperFormat;
};

export async function printPDF({ url = '', format = 'A4' }: Params) {
	const browser = await puppeteer.launch({
		headless: true,
		args: ['--disable-gpu', '--disable-dev-shm-usage', '--disable-setuid-sandbox', '--no-sandbox'],
	});
	const page = await browser.newPage();

	await page.goto(url, { waitUntil: 'networkidle0' });

	await page.waitForSelector('#CV', {
		visible: true,
	});

	await page.emulateMediaType('print');

	const pdf = await page.pdf({
		printBackground: true,
		format,
	});

	await browser.close();

	return pdf;
}
