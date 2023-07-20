import puppeteer, { type PaperFormat } from "puppeteer";
import type { RequestHandler } from "./$types";
import { CV_WIDTH } from "@/constants";

const PDF_WIDTH = CV_WIDTH;

type Params = {
	url: string;
	format?: PaperFormat;
};

async function printPDF(
	{ url = "", format = "A4" }: Params
) {
	const browser = await puppeteer.launch({
		headless: "new",
		args: [
			"--disable-gpu",
			"--disable-dev-shm-usage",
			"--disable-setuid-sandbox",
			"--no-sandbox",
		],
	});
	const page = await browser.newPage();

	await page.goto(url, { waitUntil: 'networkidle0' });

	await page.waitForSelector('#CV', {
		visible: true,
	});

	const maxWidth = PDF_WIDTH;
	const height = await page.evaluate(
		() => document.documentElement.offsetHeight
	);

	const numberOfPages = Math.ceil(height / 1040);
	const pdf = await page.pdf({
		printBackground: true,
		width: maxWidth,
		format,
		pageRanges: Array.from(new Array(numberOfPages)).map((_, key) => key + 1).join(","),
	});

	await browser.close();
	return pdf
}


export const POST: RequestHandler = async ({ request }) => {
	const { url } = await request.json();

	const pdfFile = await printPDF({ url: `${url}?pdf` }).then(pdf => {
		return pdf;
	});

	const currentYear: number = (new Date()).getFullYear();

	return new Response(
		pdfFile,
		{
			status: 200,
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': `attachment; filename=dimas-lopez-zurita-resume-${currentYear}.pdf`
			}
		}
	)
}