/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";

const settings = definePluginSettings({
    cornerStyle: {
        type: OptionType.SELECT,
        description: "Choose the corner style for avatars",
        options: [
            {
                label: "Completely Square",
                value: "0",
                default: true
            },
            {
                label: "Slightly Rounded",
                value: "4px"
            },
            {
                label: "Moderately Rounded",
                value: "8px"
            },
            {
                label: "Very Rounded",
                value: "12px"
            }
        ],
        onChange: () => {
            // Re-apply styles when setting changes
            updateAvatarStyles();
        }
    }
});

let styleElement: HTMLStyleElement | null = null;

function updateAvatarStyles() {
    // Remove old style if it exists
    if (styleElement) {
        styleElement.remove();
    }

    // Create and inject new style
    styleElement = document.createElement("style");
    styleElement.id = "square-avatars";
    styleElement.textContent = `
        /* Remove mask attribute from foreignObject elements */
        foreignObject[mask*="avatar"],
        foreignObject[mask*="round"],
        foreignObject[mask^="url(#"] {
            mask: none !important;
        }

        /* Make the actual avatar images use selected corner style */
        img[class*="avatar"],
        div[class*="avatarStack"] img {
            border-radius: ${settings.store.cornerStyle} !important;
        }

        /* My Account page avatar */
        [class*="avatar"][class*="wrapper"][role="img"] img {
            border-radius: ${settings.store.cornerStyle} !important;
        }

        /* Friends list avatars */
        [class*="peopleListItem"] foreignObject,
        [class*="peopleListItem"] img {
            mask: none !important;
            border-radius: ${settings.store.cornerStyle} !important;
        }

        /* Direct Messages list */
        [class*="privateChannels"] foreignObject,
        [class*="privateChannels"] img {
            mask: none !important;
            border-radius: ${settings.store.cornerStyle} !important;
        }

        /* Frequent Friends */
        [class*="listAvatar"] foreignObject,
        [class*="listAvatar"] img {
            mask: none !important;
            border-radius: ${settings.store.cornerStyle} !important;
        }

        /* Active Now section */
        [class*="headerAvatar"] foreignObject,
        [class*="headerAvatar"] img {
            mask: none !important;
            border-radius: ${settings.store.cornerStyle} !important;
        }

        /* Big avatar at top of message history */
        [class*="pointer"][role="button"] foreignObject,
        [class*="pointer"][role="button"] img {
            mask: none !important;
            border-radius: ${settings.store.cornerStyle} !important;
        }

        /* Avatar in chat history upper right */
        [class*="overlay"] img,
        svg[class*="mask"] foreignObject {
            mask: none !important;
            border-radius: ${settings.store.cornerStyle} !important;
        }

        /* Any SVG wrapper containing avatars */
        svg[class*="mask"] {
            overflow: visible !important;
        }

        /* Remove circular clip paths from SVG masks */
        mask circle,
        mask[id*="avatar"] circle {
            display: none !important;
        }
    `;
    document.head.appendChild(styleElement);
}

export default definePlugin({
    name: "CompletelySquare",
    description: "Turns most of the rounder elements of Discord to square. Mostly avatars/icons at the moment.",
    authors: [{ name: "Neforuss", id: 139716388n }],

    settings,

    start() {
        updateAvatarStyles();
    },

    stop() {
        // Remove CSS when plugin is disabled
        styleElement?.remove();
        styleElement = null;
    }
});
