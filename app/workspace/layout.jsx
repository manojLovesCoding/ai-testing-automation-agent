import WorkspaceHeader from "@/components/custom/WorkspaceHeader";

function WorkspaceLayout({ children }) {
  return (
    <div>
        <WorkspaceHeader/>
        {children}</div>
  )
}

export default WorkspaceLayout