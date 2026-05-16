
def seconds_to_human(seconds):
    
    if seconds < 60:
        return f"{seconds} second{'s' if seconds != 1 else ''}"
    
    minutes, secs = divmod(seconds, 60)
    hours, mins = divmod(minutes, 60)
    days, hrs = divmod(hours, 24)

    if days > 0:
        hrs_str = f" and {hrs} hour{'s' if hrs != 1 else ''}" if hrs else ""
        return f"{days} day{'s' if days != 1 else ''}{hrs_str}"
    
    if hours > 0:
        mins_str = f" and {mins} minute{'s' if mins != 1 else ''}" if mins else ""
        return f"{hrs} hour{'s' if hrs != 1 else ''}{mins_str}"
    
    secs_str = f" and {secs} second{'s' if secs != 1 else ''}" if secs else ""
    return f"{minutes} minute{'s' if minutes != 1 else ''}{secs_str}"
