import React from 'react';

type Props<T> = {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  rowClassName?: string;
};

function HomeMediaMarquee<T>({ items, renderItem, rowClassName = '' }: Props<T>) {
  const renderRow = (suffix: string) =>
    items.map((item, index) => (
      <React.Fragment key={`${suffix}-${index}`}>{renderItem(item, index)}</React.Fragment>
    ));

  return (
    <div className="home-media-marquee">
      <div className="home-media-marquee-inner">
        <div className={`home-media-marquee-row ${rowClassName}`.trim()}>{renderRow('a')}</div>
        <div className={`home-media-marquee-row ${rowClassName}`.trim()} aria-hidden="true">
          {renderRow('b')}
        </div>
      </div>
    </div>
  );
}

export default HomeMediaMarquee;
