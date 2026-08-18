"use client";

type SubjectProgress = {
  name: string;
  completed: number;
  total: number;
};

type StudyProgress = {
  completedTasks: number;
  totalTasks: number;
  completionRate: number;
  subjects: SubjectProgress[];
};

type Props = {
  data?: StudyProgress;
};

export default function StudyProgressCard({ data }: Props) {
  if (!data) {
    return (
      <div className="study-progress-card">
        <div className="tool-state">
          <strong>📊 Study Progress</strong>
          <p>Waiting for progress data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="study-progress-card">
      <div className="progress-header">
        <div>
          <h3>📊 Study Progress</h3>
          <p>Your current study progress</p>
        </div>

        <div className="progress-rate">
          {data.completionRate}%
        </div>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${data.completionRate}%`,
          }}
        />
      </div>

      <div className="progress-summary">
        <strong>
          {data.completedTasks} / {data.totalTasks}
        </strong>
        <span>tasks completed</span>
      </div>

      <div className="subject-progress">
        <h4>Subject Progress</h4>

        {data.subjects.map((subject) => {
          const percentage = Math.round(
            (subject.completed / subject.total) * 100
          );

          return (
            <div className="subject-row" key={subject.name}>
              <div className="subject-info">
                <span>{subject.name}</span>
                <span>
                  {subject.completed}/{subject.total}
                </span>
              </div>

              <div className="subject-bar">
                <div
                  className="subject-fill"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}