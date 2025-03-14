import React from "react";
import { TTextVariant } from "../../types/commonTypes";

interface TextProps {
  variant: TTextVariant;
}

const Text: React.FC<React.ComponentProps<TTextVariant> & TextProps> = ({
  variant,
  className,
  children,
  dangerouslySetInnerHTML,
}) => {
  switch (variant) {
    case "h1":
      return dangerouslySetInnerHTML ? (
        <h1
          className={className}
          dangerouslySetInnerHTML={dangerouslySetInnerHTML}
        />
      ) : (
        <h1 className={className}>{children}</h1>
      );
    case "h2":
      return dangerouslySetInnerHTML ? (
        <h2
          className={className}
          dangerouslySetInnerHTML={dangerouslySetInnerHTML}
        />
      ) : (
        <h2 className={className}>{children}</h2>
      );
    case "h3":
      return dangerouslySetInnerHTML ? (
        <h3
          className={className}
          dangerouslySetInnerHTML={dangerouslySetInnerHTML}
        />
      ) : (
        <h3 className={className}>{children}</h3>
      );
    case "h4":
      return dangerouslySetInnerHTML ? (
        <h4
          className={className}
          dangerouslySetInnerHTML={dangerouslySetInnerHTML}
        />
      ) : (
        <h4 className={className}>{children}</h4>
      );
    case "h5":
      return dangerouslySetInnerHTML ? (
        <h5
          className={className}
          dangerouslySetInnerHTML={dangerouslySetInnerHTML}
        />
      ) : (
        <h5 className={className}>{children}</h5>
      );
    case "h6":
      return dangerouslySetInnerHTML ? (
        <h6
          className={className}
          dangerouslySetInnerHTML={dangerouslySetInnerHTML}
        />
      ) : (
        <h6 className={className}>{children}</h6>
      );
    case "p":
      return dangerouslySetInnerHTML ? (
        <p
          className={className}
          dangerouslySetInnerHTML={dangerouslySetInnerHTML}
        />
      ) : (
        <p className={className}>{children}</p>
      );
    case "span":
      return dangerouslySetInnerHTML ? (
        <span
          className={className}
          dangerouslySetInnerHTML={dangerouslySetInnerHTML}
        />
      ) : (
        <span className={className}>{children}</span>
      );
    default:
      return null;
  }
};

export default Text;
