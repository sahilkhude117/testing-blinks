import { getMarket } from "@/app/lib/kalshi";
import { ActionError, ActionGetResponse, ActionPostRequest, ActionPostResponse, createActionHeaders } from "@solana/actions";
import { NextRequest, NextResponse } from "next/server"

const headers= createActionHeaders();

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ ticker: string }>}
) {
    try {
        const { ticker } = await params;

        if (!ticker || typeof ticker !== "string") {
            const error: ActionError = { message: "Ticker is required" };
            return NextResponse.json(error, {
                status: 400,
                headers
            });
        }

        const marketResponse = await getMarket(ticker);
        const requestUrl = new URL(req.url);

        const payload: ActionGetResponse = {
            type: "action",
            title: `Kalshi Market: ${ticker}`,
            icon: 'https://kalshi.com/favicon.ico',
            description: `View and interact with ${ticker} market on Kalshi`,
            label: "View Market",
            links: {
                actions: [
                    {
                        label: "View Market Details",
                        href: `${requestUrl.origin}${requestUrl.pathname}`,
                        type: "external-link"
                    },
                ],
            },
        };

        return NextResponse.json(payload, {headers});
    } catch (e: any) {
        const error: ActionError = {
            message: e.message || "unknown error"
        };
        return NextResponse.json(error, { status: 400, headers });
    }
}

export async function OPTIONS() {
    return NextResponse.json(null, { headers });
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ ticker: string }>}
) {
    try {
        const { ticker } = await params;
        const body: ActionPostRequest = await req.json();

        const marketResponse = await getMarket(ticker);

        const payload: ActionPostResponse = {
            type: "post",
            message: `Market ${ticker}: ${JSON.stringify(marketResponse.market)}`,
        };

        return NextResponse.json(payload, { headers });
    } catch (e: any) {
        const error: ActionError = { 
            message: e.message || "An unknown error occurred" 
        };
        return NextResponse.json(error, { status: 400, headers });
    }
}