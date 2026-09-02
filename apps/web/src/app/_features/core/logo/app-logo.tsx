import { isCloud } from "@/utils/environment/env";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import { ComponentProps } from "react";

const EXTERNAL_SITE_URL = "https://agencydock.de";

type Props = Omit<ComponentProps<typeof Link>, "href"> & {
  className?: string;
  iconClassName?: string;
};

// AgencyDock wordmark: light/dark SVG pair swapped via Tailwind dark: classes.
const Wordmark = ({ className }: { className?: string }) => (
  <span className={cn("inline-flex items-center", className)}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src="/brand/agencydock-logo.svg"
      alt="AgencyDock"
      className="block h-6 w-auto dark:hidden"
    />
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src="/brand/agencydock-logo-dark.svg"
      alt="AgencyDock"
      className="hidden h-6 w-auto dark:block"
    />
  </span>
);

const Mark = ({ className }: { className?: string }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src="/brand/agencydock-mark.svg"
    alt="AgencyDock"
    className={cn("block size-6", className)}
  />
);

export const AppLogo = ({ className, ...props }: Props) => {
  if (!isCloud()) {
    return (
      <a href={EXTERNAL_SITE_URL} target="_blank" rel="noopener noreferrer">
        <Wordmark className={className} />
      </a>
    );
  }

  return (
    <Link href="/" {...props}>
      <Wordmark className={className} />
    </Link>
  );
};

type AppLogoMarkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  className?: string;
};

export const AppLogoMark = ({ className, ...props }: AppLogoMarkProps) => {
  if (!isCloud()) {
    return (
      <a href={EXTERNAL_SITE_URL} target="_blank" rel="noopener noreferrer">
        <Mark className={className} />
      </a>
    );
  }

  return (
    <Link href="/" {...props}>
      <Mark className={className} />
    </Link>
  );
};
