import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

function ProtectedRoute() {
  const { status,loading } = useSelector((state) => state.auth)
    console.log("AUTH STATE 👉", status, "LOADING 👉", loading);

 if (loading) return( <div className="flex justify-center items-center py-10">
    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin">
    Checking authentication...
    </div>
  </div>
    )

  if (!status) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}

export default ProtectedRoute
