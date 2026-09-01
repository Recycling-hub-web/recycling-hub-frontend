import { Loading } from '../loading/Loading';

type TableLoadingRowProps = {
  colSpan: number;
  text?: string;
};

const TableLoadingRow = ({ colSpan, text }: TableLoadingRowProps) => (
  <tr>
    <td colSpan={colSpan} className="px-6 py-10 text-center">
      <Loading text={text} />
    </td>
  </tr>
);

export { TableLoadingRow };
export type { TableLoadingRowProps };
