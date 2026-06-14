import i18n from '../config/i18n';

export const formatPrettyDate = (dateString: string | undefined): string => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 60) return i18n.t('dateTime.justNow');

    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return i18n.t('dateTime.mAgo', { count: diffMinutes });

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return i18n.t('dateTime.hAgo', { count: diffHours });

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return i18n.t('dateTime.yesterday');
    if (diffDays < 7) return i18n.t('dateTime.dAgo', { count: diffDays });

    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks < 4) return i18n.t('dateTime.wAgo', { count: diffWeeks });

    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) return i18n.t('dateTime.moAgo', { count: diffMonths });

    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });

  } catch (error) {
    return "";
  }
};
