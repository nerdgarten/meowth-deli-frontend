"use client";
import { Progress } from "@ui/progress";
import { Button } from "@ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@ui/dialog";
import Image from "next/image";
import { useState } from "react";

type Content = {
  heading: string;
  descriptions: { text: string }[];
  imageSrc: string;
  isOnboardingOpen?: boolean;
  setIsOnboardingOpen?: (open: boolean) => void;
};

export default function OnboardingCard({
  contents,
  isOnboardingOpen,
  setIsOnboardingOpen,
}: {
  contents: Content[];
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  return (
    <Dialog open={isOnboardingOpen} onOpenChange={ setIsOnboardingOpen }>
      <DialogContent className="bg-app-white h-[32rem] w-[24rem] p-8">
        <DialogHeader>
          <DialogTitle className="text-app-dark-brown text-2xl font-semibold text-wrap">
            {contents[currentIndex]?.heading}
          </DialogTitle>
          {contents[currentIndex]?.descriptions.map((desc, index) => (
            <DialogDescription className="text-app-brown text-lg" key={index}>
              {desc.text}
            </DialogDescription>
          ))}
        </DialogHeader>
        <div className="flex h-full items-center justify-center">
          <Image
            src={contents[currentIndex]?.imageSrc || "/images/meowth-eating.webp"}
            alt={`${contents[currentIndex]?.heading} image`}
            height={180}
            width={160}
          />
        </div>
        <div className="flex items-center justify-center">
          <Progress
            value={((currentIndex + 1) / contents.length) * 100}
          />
        </div>
        <div
          className={
            currentIndex === 0 ? "flex justify-end" : "flex justify-between"
          }
        >
          <Button
            className="bg-app-yellow w-1/3 rounded-full py-5 text-lg font-semibold"
            onClick={() => {
              setCurrentIndex(currentIndex - 1);
            }}
            hidden={currentIndex === 0}
          >
            Back
          </Button>
          <Button
            className="bg-app-blue w-1/3 rounded-full py-5 text-lg font-semibold"
            onClick={() => {
              if (currentIndex + 1 < contents.length)
                setCurrentIndex(currentIndex + 1);
              else {
                  setCurrentIndex(0);
                setIsOnboardingOpen(false);
              }
            }}
          >
            {currentIndex<contents.length-1 ? "Next" : "Finish"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
