import { FC } from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"

import { routes } from "../../routes"

const IconBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px;
`

const CloseIcon: FC<{
  onClick?: () => void
}> = ({ onClick }) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ cursor: "pointer" }}
      onClick={onClick}
    >
      <circle cx="16" cy="16" r="16" fill="white" fillOpacity="0.1" />
      <path
        d="M9.34459 9.34459C9.12395 9.56524 9 9.86449 9 10.1765C9 10.4886 9.12395 10.7878 9.34459 11.0084L14.1975 15.8613C14.2343 15.8981 14.2549 15.948 14.2549 16C14.2549 16.052 14.2343 16.1019 14.1975 16.1387L9.34459 20.9916C9.12395 21.2122 9 21.5114 9 21.8235C9 22.1355 9.12395 22.4348 9.34459 22.6554C9.56524 22.876 9.86449 23 10.1765 23C10.4886 23 10.7878 22.876 11.0084 22.6554L15.8613 17.8025C15.8981 17.7657 15.948 17.7451 16 17.7451C16.052 17.7451 16.1019 17.7657 16.1387 17.8025L20.9916 22.6554C21.2122 22.876 21.5114 23 21.8235 23C22.1355 23 22.4348 22.876 22.6554 22.6554C22.876 22.4348 23 22.1355 23 21.8235C23 21.5114 22.876 21.2122 22.6554 20.9916L17.8025 16.1387C17.7657 16.1019 17.7451 16.052 17.7451 16C17.7451 15.948 17.7657 15.8981 17.8025 15.8613L22.6554 11.0084C22.876 10.7878 23 10.4886 23 10.1765C23 9.86449 22.876 9.56524 22.6554 9.34459C22.4348 9.12395 22.1355 9 21.8235 9C21.5114 9 21.2122 9.12395 20.9916 9.34459L16.1387 14.1975C16.1019 14.2343 16.052 14.2549 16 14.2549C15.948 14.2549 15.8981 14.2343 15.8613 14.1975L11.0084 9.34459C10.7878 9.12395 10.4886 9 10.1765 9C9.86449 9 9.56524 9.12395 9.34459 9.34459Z"
        fill="white"
      />
    </svg>
  )
}

const BackIcon: FC<{
  onClick?: () => void
}> = ({ onClick }) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ cursor: "pointer" }}
      onClick={onClick}
    >
      <circle cx="16" cy="16" r="16" fill="white" fillOpacity="0.1" />
      <g clipPath="url(#clip0_1326_13800)">
        <path
          d="M10 15.9814C9.99973 15.7634 10.0459 15.5478 10.1354 15.349C10.2249 15.1502 10.3556 14.9729 10.5189 14.8287L17.9384 8.28808C18.1842 8.08136 18.5011 7.97922 18.8211 8.00352C19.1411 8.02782 19.439 8.17663 19.6509 8.41812C19.8629 8.65961 19.9722 8.97461 19.9554 9.29578C19.9386 9.61695 19.7971 9.91879 19.5611 10.1367L13.073 15.8561C13.0552 15.8717 13.041 15.891 13.0312 15.9126C13.0214 15.9342 13.0163 15.9577 13.0163 15.9814C13.0163 16.0051 13.0214 16.0286 13.0312 16.0502C13.041 16.0718 13.0552 16.0911 13.073 16.1067L19.5611 21.8261C19.6865 21.9316 19.7897 22.0611 19.8644 22.2071C19.9392 22.3531 19.9841 22.5127 19.9965 22.6763C20.0089 22.8399 19.9885 23.0044 19.9365 23.16C19.8845 23.3157 19.802 23.4593 19.6939 23.5826C19.5857 23.7058 19.4541 23.8061 19.3067 23.8776C19.1592 23.9491 18.9991 23.9904 18.8355 23.999C18.6719 24.0076 18.5083 23.9833 18.3543 23.9276C18.2002 23.872 18.0588 23.786 17.9384 23.6748L10.5216 17.1361C10.3579 16.9917 10.2267 16.8141 10.1368 16.615C10.0468 16.4159 10.0002 16.1999 10 15.9814Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_1326_13800">
          <rect
            width="16"
            height="16"
            fill="white"
            transform="translate(8 8)"
          />
        </clipPath>
      </defs>
    </svg>
  )
}

export const IconBarWithIcons: FC<{
  showBack?: boolean
}> = ({ showBack = false }) => {
  const navigate = useNavigate()
  return (
    <IconBar>
      {showBack ? (
        <BackIcon
          onClick={() => {
            navigate(-1)
          }}
        />
      ) : (
        <div />
      )}
      <CloseIcon
        onClick={() => {
          navigate(routes.account())
        }}
      />
    </IconBar>
  )
}
