"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GEM_PACKS_CLIENT, GemPackType } from "@/lib/gem-packs";
import { Gem, Sparkles, Zap, Crown, Rocket } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

const PACK_ICONS: Record<GemPackType, React.ReactNode> = {
  starter: <Gem className="size-6 text-blue-500" />,
  basic: <Sparkles className="size-6 text-green-500" />,
  standard: <Zap className="size-6 text-yellow-500" />,
  pro: <Crown className="size-6 text-purple-500" />,
  enterprise: <Rocket className="size-6 text-red-500" />,
};

const PACK_COLORS: Record<GemPackType, string> = {
  starter: "border-blue-500/30 hover:border-blue-500",
  basic: "border-green-500/30 hover:border-green-500",
  standard: "border-yellow-500/30 hover:border-yellow-500 ring-2 ring-yellow-500/20",
  pro: "border-purple-500/30 hover:border-purple-500",
  enterprise: "border-red-500/30 hover:border-red-500",
};

const Page = () => {
  const [loadingPack, setLoadingPack] = useState<GemPackType | null>(null);
  const searchParams = useSearchParams();
  const success = searchParams.get("success");

  // Show success toast if redirected after payment
  if (success === "true") {
    toast.success("Payment successful! Your gems have been added.", {
      id: "payment-success",
    });
  }

  const handlePurchase = async (packType: GemPackType) => {
    try {
      setLoadingPack(packType);

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ packType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout");
      }

      // Redirect to Dodo checkout
      window.location.href = data.checkoutUrl;
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setLoadingPack(null);
    }
  };

  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full px-4">
      <section className="space-y-8 pt-[10vh] 2xl:pt-32">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              Gem Packs
            </span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Power your AI creations with gems. Buy once, use anytime - no subscriptions, no expiration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {(Object.entries(GEM_PACKS_CLIENT) as [GemPackType, typeof GEM_PACKS_CLIENT[GemPackType]][]).map(
            ([packType, pack]) => (
              <Card
                key={packType}
                className={`relative transition-all duration-300 ${PACK_COLORS[packType]} ${packType === "standard" ? "md:scale-105 shadow-lg" : ""
                  }`}
              >
                {packType === "standard" && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                    POPULAR
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto mb-2">{PACK_ICONS[packType]}</div>
                  <CardTitle className="capitalize text-lg">{packType}</CardTitle>
                  <CardDescription className="text-2xl font-bold text-foreground">
                    {pack.gems.toLocaleString()} <span className="text-sm font-normal">gems</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="text-3xl font-bold">
                    ${(pack.price / 100).toFixed(0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ${((pack.price / 100) / pack.gems).toFixed(3)}/gem
                  </p>
                  <Button
                    className="w-full"
                    variant={packType === "standard" ? "default" : "outline"}
                    disabled={loadingPack !== null}
                    onClick={() => handlePurchase(packType)}
                  >
                    {loadingPack === packType ? "Loading..." : "Buy Now"}
                  </Button>
                </CardContent>
              </Card>
            )
          )}
        </div>

        <div className="text-center text-sm text-muted-foreground space-y-2 pt-8">
          <p>💎 1 gem ≈ 500 tokens of AI generation</p>
          <p>🔄 Gems never expire - use them anytime</p>
          <p>🔒 Secure payments powered by Dodo Payments</p>
        </div>
      </section>
    </div>
  );
};

export default Page;