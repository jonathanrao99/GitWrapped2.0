"use client";

import React, { useState } from 'react';
import { Button } from './button';
import {
  Share2,
  Copy,
  Check,
  Twitter,
  Linkedin,
  Facebook,
  MessageCircle,
  Mail
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { UserStats } from '@/types';

interface ShareButtonsProps {
  username: string;
  userStats: UserStats;
  className?: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ 
  username, 
  userStats, 
  className = "" 
}) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/?user=${encodeURIComponent(username)}`
    : '';

  const shareText = `${username}'s GitWrapped: ${userStats['Total Contributions']} contributions, ${userStats['Current Streak']} day streak, ${userStats.Followers} followers! 🚀`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({ title: "Link copied to clipboard!" });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({ 
        title: "Failed to copy link", 
        description: "Please copy the URL manually",
        variant: "destructive" 
      });
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${username}'s GitWrapped`,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank');
  };

  const shareToLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(linkedinUrl, '_blank');
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {/* Native Share Button */}
      <Button
        onClick={handleNativeShare}
        className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        aria-label="Share GitWrapped"
      >
        <Share2 className="w-4 h-4" />
        Share
      </Button>

      {/* Copy Link Button */}
      <Button
        onClick={handleCopyLink}
        variant="outline"
        className="flex items-center gap-2"
        aria-label="Copy share link to clipboard"
      >
        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        {copied ? 'Copied!' : ''}
      </Button>

      {/* Social Media Buttons */}
      <div className="flex gap-1">
        <Button
          onClick={shareToTwitter}
          size="sm"
          className="bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white"
          aria-label="Share on Twitter"
        >
          <Twitter className="w-4 h-4" />
        </Button>

        <Button
          onClick={shareToLinkedIn}
          size="sm"
          className="bg-[#0077B5] hover:bg-[#006097] text-white"
          aria-label="Share on LinkedIn"
        >
          <Linkedin className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ShareButtons; 