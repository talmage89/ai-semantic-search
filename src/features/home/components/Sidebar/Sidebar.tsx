import { IndexStatsDescription } from '@pinecone-database/pinecone';
import { Spinner } from '~/ui';
import './Sidebar.scss';

type SidebarProps = {
  initialized: boolean;
  loading: boolean;
  data: IndexStatsDescription | null;
};

export const Sidebar = (props: SidebarProps) => {
  function renderUninitialized() {
    return (
      <div className="Sidebar__uninitialized">
        <Spinner label="" />
      </div>
    );
  }

  return <div className="Sidebar">{renderUninitialized()}</div>;
};
