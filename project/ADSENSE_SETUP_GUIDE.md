# Google AdSense Setup Guide

This guide will help you set up Google AdSense to monetize your PyLearn application.

## Prerequisites

1. **Google AdSense Account**: You need an approved Google AdSense account
2. **Website Domain**: Your website must be registered and approved by Google
3. **Publisher ID**: Get this from your AdSense account dashboard

## Step 1: Get Your AdSense Publisher ID

1. Sign in to your [Google AdSense account](https://adsense.google.com/)
2. Go to **Settings** → **Account information**
3. Copy your **Publisher ID** (format: `ca-pub-XXXXXXXXXXXXXXXX`)

## Step 2: Create Ad Units

1. In AdSense, go to **Ads** → **Ad units**
2. Click **+ New ad unit**
3. Create the following ad units for PyLearn:

### Recommended Ad Units:

1. **Header Banner** (728x90)
   - Type: Display ad
   - Size: 728x90 (Leaderboard)
   - Name: "Header Banner"

2. **Sidebar Vertical** (300x250)
   - Type: Display ad
   - Size: 300x250 (Medium Rectangle)
   - Name: "Sidebar Vertical"

3. **Lesson Content** (Responsive)
   - Type: Display ad
   - Size: Responsive
   - Name: "Lesson Content"

4. **Footer Banner** (728x90)
   - Type: Display ad
   - Size: 728x90 (Leaderboard)
   - Name: "Footer Banner"

## Step 3: Update Environment Variables

Edit your `.env` file with your actual AdSense publisher ID and slot IDs:

```env
# Google AdSense Configuration
VITE_ADSENSE_PUBLISHER_ID=ca-pub-YOUR_PUBLISHER_ID_HERE
VITE_ADSENSE_ENABLED=true
VITE_ADS_ENABLED=true

# Ad Slot IDs (Replace with your actual AdSense slot IDs)
VITE_AD_SLOT_HEADER_BANNER=YOUR_HEADER_BANNER_SLOT_ID
VITE_AD_SLOT_SIDEBAR_VERTICAL=YOUR_SIDEBAR_SLOT_ID
VITE_AD_SLOT_FOOTER_BANNER=YOUR_FOOTER_BANNER_SLOT_ID
VITE_AD_SLOT_LESSON_CONTENT=YOUR_LESSON_CONTENT_SLOT_ID
VITE_AD_SLOT_CHALLENGE_BETWEEN=YOUR_CHALLENGE_BETWEEN_SLOT_ID
VITE_AD_SLOT_PROFILE_SIDE=YOUR_PROFILE_SIDE_SLOT_ID
VITE_AD_SLOT_LEADERBOARD_TOP=YOUR_LEADERBOARD_TOP_SLOT_ID
```

## Step 4: Add AdSense Code to Your Website

Google AdSense requires you to add their code to your website's `<head>` section.

1. In AdSense, go to **Sites** → **Your site**
2. Click **Copy code**
3. Add the code to your `index.html` file in the `<head>` section:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PyLearn - Learn Python Programming</title>

  <!-- Google AdSense Code -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID"
          crossorigin="anonymous"></script>
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
  <script>
       (adsbygoogle = window.adsbygoogle || []).push({});
  </script>

  <!-- Other head content -->
</head>
<body>
  <!-- Your app content -->
</body>
</html>
```

## Step 5: Configure Auto Ads (Optional but Recommended)

1. In AdSense, go to **Ads** → **Overview**
2. Turn on **Auto ads**
3. Follow the setup instructions

## Step 6: Test Your Implementation

1. Update the environment variables with your actual AdSense publisher ID
2. Run your application locally
3. Check browser console for any AdSense-related errors
4. Verify ads are showing up correctly

## Ad Placement Strategy

### Current Ad Placements in PyLearn:

1. **Header Banner**: Below user stats in the header
2. **Sidebar Ads**: Right sidebar (visible on desktop only)
3. **Lesson Content Ads**: Within lesson pages
4. **Challenge Between Ads**: Between challenges
5. **Profile Side Ads**: In profile pages
6. **Footer Banner**: Bottom of the application

### Ad Frequency Control:

The application includes smart ad frequency control to:
- Show ads after every 3 user actions
- Respect ad-free premium users
- Provide optimal user experience while maximizing revenue

## Revenue Optimization Tips

1. **A/B Testing**: Test different ad placements and formats
2. **Responsive Design**: Ensure ads work well on all devices
3. **User Experience**: Don't overdo ads - maintain good UX
4. **Premium Ad-Free**: Offer ad-free premium subscriptions
5. **Analytics**: Monitor AdSense performance metrics

## Important Notes

- **Compliance**: Follow Google AdSense policies strictly
- **User Experience**: Don't compromise UX for ad revenue
- **Testing**: Always test in development before deploying
- **Privacy**: Ensure GDPR/CCPA compliance
- **Performance**: Monitor ad performance and optimize

## AdSense Policies to Follow

1. **Content Guidelines**: Ensure all content meets AdSense policies
2. **Click Fraud**: Never click your own ads or encourage others to
3. **Ad Placement**: Don't mislead users about ads
4. **Website Quality**: Maintain high-quality content
5. **Technical Requirements**: Follow technical implementation guidelines

## Troubleshooting

### Common Issues:

1. **Ads Not Showing**:
   - Check if publisher ID is correct
   - Verify ad slots are configured
   - Check browser console for errors
   - Ensure environment variables are set

2. **Revenue Low**:
   - Increase website traffic
   - Optimize ad placements
   - A/B test different formats
   - Improve content quality

3. **Policy Violations**:
   - Review AdSense policies
   - Remove prohibited content
   - Fix technical issues
   - Submit reconsideration request if needed

## Support

For AdSense-specific issues, contact Google AdSense support:
- [AdSense Help Center](https://support.google.com/adsense)
- [AdSense Policy Center](https://support.google.com/adsense/topic/61586)

For technical implementation issues, review the code in:
- `/src/components/ads/GoogleAdSense.tsx`
- `/src/components/ads/AdManager.tsx`
- `/src/contexts/AdContext.tsx`