import ErrorPage from "@/components/ui/error-3";

export default function NotFound() {
  return (
    <ErrorPage
      code="404"
      title="Endpoint Unreachable"
      description="The requested URL does not exist in the active Rotaract Presidency domain sequence."
    />
  );
}
