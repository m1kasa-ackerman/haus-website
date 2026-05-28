import Link from 'next/link';
import ProjectEditor from '@/components/studio/ProjectEditor';

export default function NewProjectPage() {
  return (
    <>
      <Link href="/studio/projects" className="studio-back">← Back to projects</Link>
      <div className="studio-head">
        <div>
          <h1>New project</h1>
          <p className="sub">Add a case study to your portfolio.</p>
        </div>
      </div>
      <ProjectEditor />
    </>
  );
}
