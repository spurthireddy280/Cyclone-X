import React, { useState } from 'react';
import { useResponse } from '../../context/ResponseContext';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import {
  ListTodo,
  CheckCircle2,
  Clock,
  AlertCircle,
  RotateCcw,
  Sparkles,
  MapPin,
  Shield,
  Filter,
  Check
} from 'lucide-react';

export default function ResponsePlannerPage() {
  const { tasks, updateTaskStatus, generateNewPlan } = useResponse();
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'Pending' | 'In Progress' | 'Completed'
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredTasks = tasks.filter(task => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'ACTIVE') return task.status === 'In Progress';
    return task.status === filterStatus;
  });

  const counts = {
    all: tasks.length,
    pending: tasks.filter(t => t.status === 'Pending').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    completed: tasks.filter(t => t.status === 'Completed').length
  };

  const handleCycleStatus = (taskId, currentStatus) => {
    let nextStatus = 'Pending';
    if (currentStatus === 'Pending') nextStatus = 'In Progress';
    else if (currentStatus === 'In Progress') nextStatus = 'Completed';
    else if (currentStatus === 'Completed') nextStatus = 'Pending';

    updateTaskStatus(taskId, nextStatus);
  };

  const handleGeneratePlan = () => {
    setIsGenerating(true);
    setTimeout(() => {
      generateNewPlan();
      setIsGenerating(false);
    }, 600);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <PageHeader
        title="Incident Response Planner"
        subtitle="Priority-ranked tactical interventions, operational assignments, and real-time execution status"
        badge={<Badge severity="info">Local Storage Persisted</Badge>}
        breadcrumbs={['Command Hub', 'Response Planner']}
      />

      {/* Toolbar: Stats & Filter Chips */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        padding: '16px 20px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)'
      }}>
        {/* Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto' }}>
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`btn btn-sm ${filterStatus === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
          >
            All Tasks ({counts.all})
          </button>
          <button
            onClick={() => setFilterStatus('Pending')}
            className={`btn btn-sm ${filterStatus === 'Pending' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Pending ({counts.pending})
          </button>
          <button
            onClick={() => setFilterStatus('ACTIVE')}
            className={`btn btn-sm ${filterStatus === 'ACTIVE' ? 'btn-primary' : 'btn-secondary'}`}
          >
            In Progress ({counts.inProgress})
          </button>
          <button
            onClick={() => setFilterStatus('Completed')}
            className={`btn btn-sm ${filterStatus === 'Completed' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Completed ({counts.completed})
          </button>
        </div>

        {/* Generate Plan Button */}
        <Button
          variant="secondary"
          icon={Sparkles}
          isLoading={isGenerating}
          loadingText="Synthesizing..."
          onClick={handleGeneratePlan}
        >
          Generate New Response Plan
        </Button>
      </div>

      {/* Response Task List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredTasks.length === 0 ? (
          <div className="surface-card" style={{ padding: '48px', textAlign: 'center' }}>
            <CheckCircle2 size={36} color="var(--color-success)" style={{ margin: '0 auto 12px' }} />
            <h3 className="font-display font-semibold" style={{ fontSize: '16px', color: 'var(--text-primary)' }}>
              No tasks match this filter state
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              All response tasks for this view have been resolved or re-categorized.
            </p>
          </div>
        ) : (
          filteredTasks.map((task, idx) => {
            const isCompleted = task.status === 'Completed';
            const isInProgress = task.status === 'In Progress';

            return (
              <div
                key={task.id}
                className="surface-card"
                style={{
                  padding: '20px 24px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '18px',
                  borderColor: isInProgress ? 'var(--accent-cyan)' : isCompleted ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-subtle)',
                  background: isInProgress ? 'rgba(0, 240, 255, 0.02)' : 'var(--bg-card)',
                  opacity: isCompleted ? 0.75 : 1,
                  transition: 'all var(--transition-fast)'
                }}
              >
                {/* Left: Rank, Priority & Title */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flex: 1, minWidth: '280px' }}>
                  <div
                    className="font-mono font-bold"
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 'var(--radius-sm)',
                      background: isInProgress ? 'var(--accent-cyan)' : isCompleted ? 'var(--color-success)' : 'rgba(255, 255, 255, 0.05)',
                      color: isInProgress || isCompleted ? '#06080D' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      flexShrink: 0
                    }}
                  >
                    0{task.rank || idx + 1}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <Badge severity={task.priority.includes('CRITICAL') ? 'critical' : 'warning'}>
                        {task.priority}
                      </Badge>
                      <span className="font-mono" style={{ fontSize: '11px', color: 'var(--color-critical)' }}>
                        Urgency: {task.urgency}
                      </span>
                    </div>

                    <h3 style={{
                      fontSize: '15px',
                      fontWeight: 600,
                      color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
                      textDecoration: isCompleted ? 'line-through' : 'none'
                    }}>
                      {task.title}
                    </h3>

                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                      {task.reason}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '11px', color: 'var(--text-dim)', marginTop: '8px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} color="var(--text-dim)" />
                        <span>Area: {task.area}</span>
                      </span>
                      <span>•</span>
                      <span>Assigned: {task.assignedTo}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Interactive Status Toggle Button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={() => handleCycleStatus(task.id, task.status)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      border: '1px solid',
                      transition: 'all var(--transition-fast)',
                      background: isInProgress
                        ? 'rgba(0, 240, 255, 0.15)'
                        : isCompleted
                        ? 'rgba(16, 185, 129, 0.15)'
                        : 'rgba(255, 255, 255, 0.05)',
                      borderColor: isInProgress
                        ? 'var(--accent-cyan)'
                        : isCompleted
                        ? 'var(--color-success)'
                        : 'var(--border-medium)',
                      color: isInProgress
                        ? 'var(--accent-cyan)'
                        : isCompleted
                        ? 'var(--color-success)'
                        : 'var(--text-secondary)'
                    }}
                    title="Click to toggle status: Pending -> In Progress -> Completed"
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={15} />
                    ) : isInProgress ? (
                      <Clock size={15} className="animate-spin" />
                    ) : (
                      <AlertCircle size={15} />
                    )}
                    <span>{task.status}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
