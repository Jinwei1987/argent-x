import { FC } from "react"
import { useNavigate } from "react-router-dom"

import { routes } from "../routes"
import { Banner } from "./Banner"

interface RecoveryBannerProps {
  noMargins?: boolean
}

export const RecoveryBanner: FC<RecoveryBannerProps> = ({ noMargins }) => {
  const navigate = useNavigate()
  return (
    <Banner
      title="Set up account recovery"
      description="All your funds are at risk"
      noMargins={noMargins}
      icon={
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12ZM11.0001 12.5V6.5C11.0001 6.23479 11.1054 5.98043 11.293 5.7929C11.4805 5.60536 11.7349 5.5 12.0001 5.5C12.2653 5.5 12.5197 5.60536 12.7072 5.7929C12.8947 5.98043 13.0001 6.23479 13.0001 6.5V12.5C13.0001 12.7652 12.8947 13.0196 12.7072 13.2071C12.5197 13.3946 12.2653 13.5 12.0001 13.5C11.7349 13.5 11.4805 13.3946 11.293 13.2071C11.1054 13.0196 11.0001 12.7652 11.0001 12.5ZM10.5941 15.9668C10.5248 16.1504 10.4929 16.3459 10.5001 16.542C10.5153 16.9362 10.6823 17.3092 10.9661 17.5831C11.2499 17.8571 11.6286 18.0107 12.0231 18.012H12.0501C12.2463 18.0087 12.4399 17.9662 12.6195 17.8872C12.7991 17.8081 12.9611 17.6939 13.0961 17.5515C13.231 17.409 13.3362 17.241 13.4054 17.0574C13.4746 16.8737 13.5064 16.6781 13.4991 16.482C13.4844 16.0877 13.3175 15.7143 13.0336 15.4403C12.7497 15.1663 12.3707 15.0128 11.9761 15.012H11.9491C11.7529 15.0155 11.5594 15.058 11.3798 15.1371C11.2003 15.2162 11.0383 15.3304 10.9034 15.4728C10.7685 15.6153 10.6633 15.7832 10.5941 15.9668Z"
            fill="#C12026"
          />
        </svg>
      }
      onClick={() => {
        navigate(routes.setupRecovery())
      }}
    />
  )
}
