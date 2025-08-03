import { useMediaQuery } from "@mui/material";

const useIsMobile = () => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'))
  return isMobile
}

export default useIsMobile